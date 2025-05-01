<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require "contact/PHPMailer/src/PHPMailer.php";
require "contact/PHPMailer/src/SMTP.php";
require "contact/PHPMailer/src/Exception.php";
require_once "Template.class.php";

// On charge le template HTML
$page = new Template("index.html");

// Si le formulaire est soumis
if (isset($_POST["nom"])) {
    $nom = htmlspecialchars($_POST["nom"]);
    $email = htmlspecialchars($_POST["email"]);
    $messageTexte = nl2br(htmlspecialchars($_POST["message"]));

    $messageHTML = "<div style='font-family:Arial;padding:20px;background:#f9f9f9;border-radius:10px;'>
                        <h2 style='color:#213b74;'>📩 Nouveau message</h2>
                        <p><strong>Nom :</strong> $nom</p>
                        <p><strong>Email :</strong> $email</p>
                        <p><strong>Message :</strong><br>$messageTexte</p>
                    </div>";

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'abderhamia@gmail.com';
        $mail->Password = 'lwrz yxvu orsz oshv'; // mot de passe d'application
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;

        $mail->setFrom('abderhamia@gmail.com', 'Nazim HAMIA');
        $mail->addAddress('abderhamia@gmail.com');

        $mail->isHTML(true);
        $mail->Subject = "Une personne souhaite vous contacter";
        $mail->Body = $messageHTML;
        $mail->AltBody = strip_tags($messageHTML);

        $mail->send();

        // Affiche le message de confirmation dans le template
        $page->Replace("none", "block");

    } catch (Exception $e) {
        echo "Erreur lors de l'envoi : {$mail->ErrorInfo}";
    }
}

// Affiche toujours le contenu de index.html avec ou sans formulaire soumis
$page->Display();
