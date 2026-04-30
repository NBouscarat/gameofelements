<?php 
require_once('../simplesaml/lib/_autoload.php');
$as = new \SimpleSAML\Auth\Simple('default-sp');
if (!$as->isAuthenticated()) {
$as->requireAuth();
}

$attributes = $as->getAttributes();
$jsonAttributes = json_encode($attributes); // Convert attributes to JSON 

// check if [MEN-Affilation] is set and if any value contain TEACHER

// return JSON of the attributes


/*
Array
(
    [urn:oid:2.5.4.42] => Array
        (
            [0] => Nicolas
        )

    [MEN-Affilation] => Array
        (
            [0] => LAM-TEACHER
            [1] => SCRIPT-OTHER
        )

    [urn:oid:0.9.2342.19200300.100.1.1] => Array
        (
            [0] => bouni204
        )

    [IdP] => Array
        (
            [0] => urn:x-auth-education-lu:auth:lt:iam
        )

)
*/
header('Content-Type: application/json');
echo $jsonAttributes; // Output the JSON attributes
/*
MODIFY each index.html to include the following code snippet after the line:
INDEX.PHP
First line :
<?php
    include('data.php');
?>


In the header section of the HTML file, add the following code snippet to make the PHP data available in JavaScript:


<script>
        // Récupérer les données PHP dans une constante JavaScript
        const IAMResult = <?php echo $jsonAttributes; ?>;
</script>


 */


?>