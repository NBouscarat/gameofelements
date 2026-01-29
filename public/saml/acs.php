<?php
require_once 'vendor/autoload.php'; // Chargez les dépendances si vous utilisez Composer

use OneLogin\Saml2\Auth;
use OneLogin\Saml2\Error;

// Configuration SAML
$settings = [
    'sp' => [
        'entityId' => 'https://app.script.lu/goe/',
        'assertionConsumerService' => [
            'url' => 'https://app.script.lu/saml/acs',
        ],
        'singleLogoutService' => [
            'url' => 'https://app.script.lu/saml/logout',
        ],
        'x509cert' => '-----BEGIN CERTIFICATE-----
MIIC+zCCAeOgAwIBAgIJALa... (votre certificat SP ici)
-----END CERTIFICATE-----',
        'privateKey' => '-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBK... (votre clé privée ici)
-----END PRIVATE KEY-----',
    ],
    'idp' => [
        'entityId' => 'https://idp.example.com/metadata',
        'singleSignOnService' => [
            'url' => 'https://idp.example.com/sso',
        ],
        'singleLogoutService' => [
            'url' => 'https://idp.example.com/slo',
        ],
        'x509cert' => '-----BEGIN CERTIFICATE-----
MIIC... (certificat public de l’IdP ici)
-----END CERTIFICATE-----',
    ],
    'security' => [
        'authnRequestsSigned' => true,
        'wantAssertionsSigned' => true,
        'wantMessagesSigned' => true,
    ],
];

try {
    // Initialiser l'authentification SAML
    $auth = new Auth($settings);

    // Traiter la réponse SAML
    $auth->processResponse();

    // Vérifier si la réponse est valide
    if (!$auth->isAuthenticated()) {
        throw new Exception('SAML Response is not valid.');
    }

    // Récupérer les attributs de l'utilisateur
    $attributes = $auth->getAttributes();
    $nameId = $auth->getNameId();

    // Exemple : Stocker les informations de l'utilisateur dans une session
    session_start();
    $_SESSION['user'] = [
        'nameId' => $nameId,
        'attributes' => $attributes,
    ];

     // Chiffrer le nameId avec une clé secrète
     $secretKey = 'GameOfElements'; // Remplacez par une clé secrète forte
     $encryptedNameId = openssl_encrypt(
         $nameId,
         'AES-256-CBC',
         $secretKey,
         0,
         substr(hash('sha256', $secretKey), 0, 16) // IV dérivé de la clé
     );
 
     if ($encryptedNameId === false) {
         throw new Exception('Failed to encrypt nameId.');
     }
 
     // Encoder le résultat pour l'utiliser dans l'URL
     $encodedNameId = urlencode($encryptedNameId);
 
     // Rediriger l'utilisateur vers l'application après authentification
     header('Location: https://app.script.lu/goe/?IAM=' . $encodedNameId);
    exit();
} catch (Error $e) {
    // Gérer les erreurs SAML
    echo 'SAML Error: ' . $e->getMessage();
    exit();
} catch (Exception $e) {
    // Gérer les erreurs générales
    echo 'Error: ' . $e->getMessage();
    exit();
}