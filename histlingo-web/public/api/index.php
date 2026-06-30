<?php
// HistLingo API Proxy com auto-recuperacao
// Se o NestJS (porta 3000) estiver fora, tenta reiniciar automaticamente.

define('NEST_HOST', '127.0.0.1');
define('NEST_PORT', 3000);
define('BE_PATH',   '/home/u694432103/histlingo');
define('NODE_PATH', '/opt/alt/alt-nodejs20/root/usr/bin:/home/u694432103/local/bin:/usr/local/bin:/usr/bin:/bin');

function nestIsUp(): bool {
    $sock = @fsockopen(NEST_HOST, NEST_PORT, $errno, $errstr, 1.5);
    if ($sock) { fclose($sock); return true; }
    return false;
}

function tryStartNest(): void {
    $cmd = sprintf(
        'export PATH=%s; export HOME=/home/u694432103; cd %s && pm2 start ecosystem.config.js > /dev/null 2>&1',
        NODE_PATH, BE_PATH
    );
    $disabled = array_map('trim', explode(',', (string)ini_get('disable_functions')));

    if (function_exists('shell_exec') && !in_array('shell_exec', $disabled)) {
        shell_exec($cmd . ' &');
    } elseif (function_exists('exec') && !in_array('exec', $disabled)) {
        exec($cmd . ' > /dev/null 2>&1 &');
    } elseif (function_exists('proc_open')) {
        $desc = [['pipe','r'],['pipe','w'],['pipe','w']];
        $p = proc_open('bash -c ' . escapeshellarg($cmd . ' &'), $desc, $pipes);
        if ($p) proc_close($p);
    }
}

// ── Auto-recuperacao ──────────────────────────────────────────────────────────
if (!nestIsUp()) {
    tryStartNest();
    // Aguarda até 8s o NestJS subir
    $up = false;
    for ($i = 0; $i < 8; $i++) {
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

// Apache CGI remove Authorization — recuperamos via RewriteRule no .htaccess
$headers  = [];
$hasAuth  = false;
foreach (getallheaders() as $name => $value) {
    $lower = strtolower($name);
    if ($lower === 'host' || $lower === 'connection') continue;
    if ($lower === 'authorization') $hasAuth = true;
    $headers[] = "$name: $value";
}
if (!$hasAuth) {
    $auth = $_SERVER['HTTP_AUTHORIZATION']
         ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
         ?? null;
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
