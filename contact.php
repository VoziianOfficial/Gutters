<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

function field(string $name): string
{
    return trim((string)($_POST[$name] ?? ''));
}

$firstName = field('first_name');
$lastName = field('last_name');
$email = field('email');
$service = field('service');
$preferredDate = field('preferred_date');
$message = field('message');

if ($firstName === '' || $lastName === '' || $email === '' || $service === '' || $message === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Required fields are missing']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

$allowedServices = [
    'Gutter Installation',
    'Gutter Cleaning',
    'Gutter Repair',
    'Downspouts',
    'Gutter Guards',
    'Maintenance',
];

if (!in_array($service, $allowedServices, true)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Invalid service']);
    exit;
}

$configPath = __DIR__ . '/config/config.js';
$recipient = 'hello@flowline-gutters.example';
if (is_readable($configPath)) {
    $config = file_get_contents($configPath);
    if (preg_match('/email:\s*"([^"]+)"/', (string)$config, $match) === 1) {
        $recipient = $match[1];
    }
}

$submission = [
    'created_at' => gmdate('c'),
    'first_name' => $firstName,
    'last_name' => $lastName,
    'email' => $email,
    'service' => $service,
    'preferred_date' => $preferredDate,
    'message' => $message,
];

$logLine = json_encode($submission, JSON_UNESCAPED_SLASHES) . PHP_EOL;
file_put_contents(__DIR__ . '/submissions.log', $logLine, FILE_APPEND | LOCK_EX);

$subject = 'New gutter service request';
$body = implode("\n", [
    'New gutter service request',
    '',
    'Name: ' . $firstName . ' ' . $lastName,
    'Email: ' . $email,
    'Service: ' . $service,
    'Preferred date: ' . ($preferredDate !== '' ? $preferredDate : 'Not specified'),
    '',
    'Message:',
    $message,
]);
$headers = [
    'From: ' . $recipient,
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
];

@mail($recipient, $subject, $body, implode("\r\n", $headers));

echo json_encode(['success' => true, 'message' => 'Successfully sent']);
