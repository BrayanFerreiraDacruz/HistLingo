<?php
// HistLingo API Proxy — encaminha /api/* para NestJS na porta 3000
$uri    = $_SERVER['REQUEST_URI'] ?? '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$target = 'http://127.0.0.1:3000' . $uri;
$body   = file_get_contents('php://input');

// Apache em modo CGI/FastCGI remove o header Authorization.
// O .htaccess salva em HTTP_AUTHORIZATION via RewriteRule.
$headers = [];
$authSent = false;

foreach (getallheaders() as $name => $value) {
    $lower = strtolower($name);
    if ($lower === 'host' || $lower === 'connection') continue;
    if ($lower === 'authorization') $authSent = true;
    $headers[] = "$name: $value";
}

// Fallback para o valor salvo pelo .htaccess
if (!$authSent) {
    $auth = $_SERVER['HTTP_AUTHORIZATION']
         ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
         ?? null;
    if ($auth) {
        $headers[] = "Authorization: $auth";
    }
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
