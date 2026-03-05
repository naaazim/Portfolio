<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require "contact/PHPMailer/src/PHPMailer.php";
require "contact/PHPMailer/src/SMTP.php";
require "contact/PHPMailer/src/Exception.php";
require_once "Template.class.php";

// ─── Chargement du fichier .env ─────────────────────
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#'))
            continue;
        [$key, $val] = array_map('trim', explode('=', $line, 2));
        $_ENV[$key] = $val;
    }
}

$mailUsername = $_ENV['MAIL_USERNAME'] ?? '';
// Suppression des espaces accidentels dans le mot de passe d'application Gmail
$mailPassword = str_replace(' ', '', $_ENV['MAIL_PASSWORD'] ?? '');
$mailFromName = $_ENV['MAIL_FROM_NAME'] ?? 'Nazim HAMIA';
$mailTo = $_ENV['MAIL_TO'] ?? $mailUsername;

// ─── Chargement du template HTML ────────────────────
$page = new Template("index.html");

// ─── Traitement du formulaire ────────────────────────
if (isset($_POST["nom"])) {
    header('Content-Type: application/json');

    $nom = htmlspecialchars($_POST["nom"]);
    $email = htmlspecialchars($_POST["email"]);
    $messageTexte = nl2br(htmlspecialchars($_POST["message"]));

    $messageHTML = "
        <div style='font-family:Inter,Arial,sans-serif;padding:28px;background:#f8fdf9;border-radius:12px;max-width:560px;'>
            <div style='background:#16a85a;color:#fff;padding:14px 20px;border-radius:8px;margin-bottom:20px;'>
                <h2 style='margin:0;font-size:18px;'>📩 Nouveau message reçu</h2>
            </div>
            <p style='margin:8px 0;'><strong>Nom :</strong> $nom</p>
            <p style='margin:8px 0;'><strong>Email :</strong> <a href='mailto:$email'>$email</a></p>
            <hr style='margin:16px 0;border:none;border-top:1px solid #e5e7eb;'>
            <p style='margin:8px 0;'><strong>Message :</strong><br>$messageTexte</p>
        </div>";

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = $mailUsername;
        $mail->Password = $mailPassword;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;

        $mail->CharSet = 'UTF-8';
        $mail->setFrom($mailUsername, $mailFromName);
        $mail->addAddress($mailTo);
        $mail->addReplyTo($email, $nom);

        $mail->isHTML(true);
        $mail->Subject = "✉️ $nom souhaite vous contacter";
        $mail->Body = $messageHTML;
        $mail->AltBody = strip_tags($messageHTML);
        $mail->send();

        echo json_encode(['success' => true, 'message' => 'Message envoyé avec succès']);
        exit;

    } catch (Exception $e) {
        error_log("Erreur PHPMailer : " . $mail->ErrorInfo);
        echo json_encode(['success' => false, 'message' => "Une erreur est survenue. L'e-mail n'a pas pu être envoyé."]);
        exit;
    }
}

// Affiche le contenu de index.html
$page->Display();
