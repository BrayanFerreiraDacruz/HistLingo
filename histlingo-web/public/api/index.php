<?php
// HistLingo API Proxy com auto-recuperacao permanente
// Inicia o NestJS diretamente via proc_open se a porta 3000 estiver fora.

define('NEST_HOST', '127.0.0.1');
define('NEST_PORT', 3000);
define('BE_PATH',   '/home/u694432103/histlingo');
define('NODE_BIN',  '/opt/alt/alt-nodejs20/root/usr/bin/node');
define('NODE_PATH', '/opt/alt/alt-nodejs20/root/usr/bin:/home/u694432103/local/bin:/usr/local/bin:/usr/bin:/bin');
define('PM2_BIN',   '/home/u694432103/local/bin/pm2');

function nestIsUp(): bool {
    $sock = @fsockopen(NEST_HOST, NEST_PORT, $errno, $errstr, 1.5);
    if ($sock) { fclose($sock); return true; }
    return false;
}

function loadEnv(): array {
    $env = [
        'HOME'     => '/home/u694432103',
        'PATH'     => NODE_PATH,
        'NODE_ENV' => 'production',
    ];
    $lines = @file(BE_PATH . '/.env') ?: [];
    foreach ($lines as $line) {
        $line = trim($line);
        if (!$line || $line[0] === '#' || !str_contains($line, '=')) continue;
        [$k, $v] = explode('=', $line, 2);
        $env[trim($k)] = trim($v, "'\"");
    }
    return $env;
}

function tryStartNest(): void {
    if (!function_exists('proc_open')) return;

    $env  = loadEnv();
    $desc = [
        0 => ['pipe', 'r'],
        1 => ['file', BE_PATH . '/logs/out.log',   'a'],
        2 => ['file', BE_PATH . '/logs/error.log', 'a'],
    ];

    // Tenta via PM2 primeiro (se daemon estiver rodando)
    if (is_executable(PM2_BIN)) {
        $pm2cmd = PM2_BIN . ' start ' . BE_PATH . '/ecosystem.config.js 2>/dev/null || ' .
                  PM2_BIN . ' restart histlingo 2>/dev/null';
        $h = @proc_open('bash -c ' . escapeshellarg($pm2cmd), $desc, $pipes, BE_PATH, $env);
        if ($h) { proc_close($h); return; }
    }

    // Fallback: inicia node diretamente (funciona mesmo sem PM2)
    $nodeCmd = NODE_BIN . ' ' . BE_PATH . '/dist/main.js';
    $h = @proc_open(
        'bash -c ' . escapeshellarg('nohup ' . $nodeCmd . ' </dev/null &'),
        $desc, $pipes, BE_PATH, $env
    );
    if ($h) proc_close($h);
}

// ── Auto-recuperacao ──────────────────────────────────────────────────────────
if (!nestIsUp()) {
    tryStartNest();
    $up = false;
    for ($i = 0; $i < 12; $i++) {
        sleep(1);
        if (nestIsUp()) { $up = true; break; }
    }
    if (!$up) {
        http_response_code(503);
        header('Content-Type: application/json');
        echo json_encode([
            'statusCode' => 503,
            'message'    => 'Servidor iniciando, tente novamente em alguns segundos.',
        ]);
        exit;
    }
}

// ── Proxy da requisição ───────────────────────────────────────────────────────
$uri    = $_SERVER['REQUEST_URI'] ?? '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$target = 'http://' . NEST_HOST . ':' . NEST_PORT . $uri;
$body   = file_get_contents('php://input');

$headers = [];
$hasAuth = false;
foreach (getallheaders() as $name => $value) {
    $lower = strtolower($name);
    if ($lower === 'host' || $lower === 'connection') continue;
    if ($lower === 'authorization') $hasAuth = true;
    $headers[] = "$name: $value";
}
if (!$hasAuth) {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null;
    if ($auth) $headers[] = "Authorization: $auth";
}

$ch = curl_init($target);
curl_setopt_array($ch, [
    CURLOPT_CUSTOMREQUEST  => $method,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER         => true,
    CURLOPT_HTTPHEADER     => $headers,
    CURLOPT_TIMEOUT        => 30,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_FOLLOWLOCATION => false,
]);
if ($body !== false && strlen($body) > 0) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
}

$raw   = curl_exec($ch);
$errno = curl_errno($ch);

if ($errno || $raw === false) {
    http_response_code(503);
    header('Content-Type: application/json');
    echo json_encode(['statusCode' => 503, 'message' => 'Servidor em manutenção. Tente novamente em instantes.']);
    curl_close($ch);
    exit;
}

$status   = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
$hsize    = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

$body_out = substr($raw, $hsize);
$hdrs_raw = substr($raw, 0, $hsize);

http_response_code($status);
foreach (explode("\r\n", $hdrs_raw) as $h) {
    $l = strtolower($h);
    if (str_starts_with($l, 'transfer-encoding') ||
        str_starts_with($l, 'connection') ||
        str_starts_with($l, 'http/')) continue;
    if (str_contains($h, ':')) header($h, false);
}
echo $body_out;
