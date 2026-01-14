<?php
// ADD HEADER 
// JSON type
header('Content-type: application/json');
// ALLOW CORS for development (This should be restricted to developement environnement to prevent Xsite forgery attack)
header('Access-Control-Allow-Origin: https://app.script.lu');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');

$servername = "mysql.restena.lu";
$username = "scriptmisc";
$password = "HG7uN4MqBh";
$db = "scriptappsdb";
$data = json_decode( file_get_contents( 'php://input' ), true );

// Create connection
$conn = new mysqli($servername, $username, $password,$db);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

 // CREATE
if($data["action"] === "INSERT_ELEMENT"){
    // INSERT ELEMENT FROM POST DATA
    $stmt = $conn->prepare("INSERT INTO goe_elements (`id`,`position`,`name`,`symbol`,`atomicNumber`,`color`) 
    VALUES (0,?,?,?,?,?)");
    $stmt->bind_param("sssis",$data["element"]["position"],$data["element"]["name"],$data["element"]["symbol"],$data["element"]["atomicNumber"],$data["element"]["color"]);
    try {
        if ($stmt->execute()) {
            // Récupération de l'ID de la ligne insérée
            $elementId = $stmt->insert_id;
            // INSERT QUESTIONS
            $stmtQ = $conn->prepare("INSERT INTO goe_questions (`id`,`isDefault`,`difficulty`,`text_fr`,`text_de`,`text_en`,`text_lu`,`answer_fr`,`answer_de`,`answer_en`,`answer_lu`,`element_id`,`user_id`) VALUES (0,?,?,?,?,?,?,?,?,?,?,?,?)");
            $isDefault = $data["isDefault"]; 
            $stmtQ->bind_param("isssssssssii",
                $data["element"]["questionEasy"]["isDefault"],
                $difficulty="easy",
                $data["element"]["questionEasy"]["text"]["fr"],
                $data["element"]["questionEasy"]["text"]["de"],
                $data["element"]["questionEasy"]["text"]["en"],
                $data["element"]["questionEasy"]["text"]["lu"],
                $data["element"]["questionEasy"]["answer"]["fr"],
                $data["element"]["questionEasy"]["answer"]["de"],
                $data["element"]["questionEasy"]["answer"]["en"],
                $data["element"]["questionEasy"]["answer"]["lu"],
                $elementId,
                $data["user_id"]
            );
            $stmtQ->execute();

            $stmtQ->bind_param("isssssssssii",
                $data["element"]["questionHard"]["isDefault"],
                $difficulty="hard",
                $data["element"]["questionHard"]["text"]["fr"],
                $data["element"]["questionHard"]["text"]["de"],
                $data["element"]["questionHard"]["text"]["en"],
                $data["element"]["questionHard"]["text"]["lu"],
                $data["element"]["questionHard"]["answer"]["fr"],
                $data["element"]["questionHard"]["answer"]["de"],
                $data["element"]["questionHard"]["answer"]["en"],
                $data["element"]["questionHard"]["answer"]["lu"],
                $elementId,
                $data["user_id"]
            );
            $stmtQ->execute();
            // INSERT EXPERIEMENT IF ANY
            if(isset($data["element"]["experiment"])){
                $stmtEQ = $conn->prepare("INSERT INTO goe_experiments (`id`,`element_id`,`setup_fr`,`setup_de`,`setup_en`,`setup_lu`,`explanation_fr`,`explanation_de`,`explanation_en`,`explanation_lu`) VALUES (0,?,?,?,?,?,?,?,?,?,?)");
                $stmtEQ->bind_param("isssssssss",
                    $elementId,
                    $data["element"]["experiment"]["setup"]["fr"],
                    $data["element"]["experiment"]["setup"]["de"],
                    $data["element"]["experiment"]["setup"]["en"],
                    $data["element"]["experiment"]["setup"]["lu"],
                    $data["element"]["experiment"]["explanation"]["fr"],
                    $data["element"]["experiment"]["explanation"]["de"],
                    $data["element"]["experiment"]["explanation"]["en"],
                    $data["element"]["experiment"]["explanation"]["lu"]);
                $stmtEQ->execute();
            }

        }
        
    } catch (\Throwable $th) {
        echo $th;
    }
   
    // GET USER ID BY IAM or INSERT NEW USER IF NOT EXISTS
    

    


}

// READ
if($data["action"] === "GET"){
    $sql = "SELECT 
     e.id as element_id, 
     e.position as position,
     e.name,
     e.symbol,
     e.atomicNumber,
     e.color,
     u.iam as iam,
     u.isAdmin as isAdmin,
     q.isDefault as isDefault,
     q.difficulty as difficulty,
     q.id as question_id,
     q.text_fr as text_fr,
     q.text_en as text_en,
     q.text_de as text_de,
     q.text_lu as text_lu,
     q.answer_fr as answer_fr,
     q.answer_en as answer_en,
     q.answer_de as answer_de,
     q.answer_lu as answer_lu,
     q.moreInfo_fr as moreinfo_fr,
     q.moreInfo_en as moreinfo_en,
     q.moreInfo_de as moreinfo_de,
     q.moreInfo_lu as moreinfo_lu,
     ex.id as experiment_id,
     ex.setup_fr as setup_fr,
     ex.setup_en as setup_en,
     ex.setup_de as setup_de,
     ex.setup_lu as setup_lu,
     ex.explanation_fr as explanation_fr,
     ex.explanation_en as explanation_en,
     ex.explanation_de as explanation_de,
     ex.explanation_lu as explanation_lu
     FROM `goe_questions` as q 
     LEFT JOIN goe_elements as e ON q.element_id = e.id
     LEFT JOIN goe_experiments as ex on ex.element_id = e.id
     LEFT JOIN goe_users as u on q.user_id = u.id";
      try {
         $result = $conn->query($sql);
         if ($result->num_rows > 0) {
             $elements = [];
             $questions = [];
             $experiments = [];
             while($row = $result->fetch_assoc()) {
                 // filter only elements data 
                 $tmpRow = array("element_id"=>$row["element_id"],
                                 "experiment_id"=>$row["experiment_id"],
                                 "question_id"=>$row["question_id"],
                                 "position"=>$row["position"],
                                 "name"=>$row["name"],
                                 "symbol"=>$row["symbol"],
                                 "atomicNumber"=>$row["atomicNumber"],
                                 "color"=>$row["color"],
                                 "iam"=>$row["iam"],
                                 "isAdmin"=>$row["isAdmin"],
                                 "isDefault"=>$row["isDefault"],
                                 "difficulty"=>$row["difficulty"],
                                 "text_fr"=>$row["text_fr"],
                                 "text_en"=>$row["text_en"],
                                 "text_de"=>$row["text_de"],
                                 "text_lu"=>$row["text_lu"],
                                 "answer_fr"=>$row["answer_fr"],
                                 "answer_en"=>$row["answer_en"],
                                 "answer_de"=>$row["answer_de"],
                                 "answer_lu"=>$row["answer_lu"],
                                 "moreInfo_fr"=>$row["moreInfo_fr"],
                                 "moreInfo_en"=>$row["moreInfo_en"],
                                 "moreInfo_de"=>$row["moreInfo_de"],
                                 "moreInfo_lu"=>$row["moreInfo_lu"],
                                 "setup_fr"=>$row["setup_fr"],
                                 "setup_en"=>$row["setup_en"],
                                 "setup_de"=>$row["setup_de"],
                                 "setup_lu"=>$row["setup_lu"],
                                 "explanation_fr"=>$row["explanation_fr"],
                                 "explanation_en"=>$row["explanation_en"],
                                 "explanation_de"=>$row["explanation_de"],
                                 "explanation_lu"=>$row["explanation_lu"],);
                 //if element_id not already in elements array, add it
                 $found = false;
                 foreach($elements as $element){
                     if($element["id"] == $tmpRow["element_id"]){
                         $found = true;
                         break;
                     }
                 }
                 if(!$found){
                     $tmp_element = array("id"=>$tmpRow["element_id"],
                                         "position"=>$tmpRow["position"],
                                         "name"=>$tmpRow["name"],
                                         "symbol"=>$tmpRow["symbol"],
                                         "atomicNumber"=>$tmpRow["atomicNumber"],
                                         "color"=>$tmpRow["color"],
                                         "questions"=>[],
                                         "experiment"=> array(  "id"=>$tmpRow["experiment_id"],
                                             "setup"=>[
                                                 "fr"=>$tmpRow["setup_fr"],
                                                 "en"=>$tmpRow["setup_en"],
                                                 "de"=>$tmpRow["setup_de"],
                                                 "lu"=>$tmpRow["setup_lu"],
                                             ],
                                             "explanation"=>[
                                                 "fr"=>$tmpRow["explanation_fr"],
                                                 "en"=>$tmpRow["explanation_en"],
                                                 "de"=>$tmpRow["explanation_de"],
                                                 "lu"=>$tmpRow["explanation_lu"],
                                             ],
                                             ),
                                         );
                     array_push($elements,$tmp_element);
                 }
                 
                 $tmp_question = array(  "id"=>$tmpRow["question_id"],
                                         "isDefault"=>$tmpRow["isDefault"],
                                         "difficulty"=>$tmpRow["difficulty"],
                                         "text"=>[
                                             "fr"=>$tmpRow["text_fr"],
                                             "en"=>$tmpRow["text_en"],
                                             "de"=>$tmpRow["text_de"],
                                             "lu"=>$tmpRow["text_lu"],
                                         ],
                                         "answer"=>[
                                             "fr"=>$tmpRow["answer_fr"],
                                             "en"=>$tmpRow["answer_en"],
                                             "de"=>$tmpRow["answer_de"],
                                             "lu"=>$tmpRow["answer_lu"],
                                         ],
                                         "moreInfo"=>[
                                             "fr"=>$tmpRow["answer_fr"],
                                             "en"=>$tmpRow["answer_en"],
                                             "de"=>$tmpRow["answer_de"],
                                             "lu"=>$tmpRow["answer_lu"],
                                         ],
                                         "element_id"=>$tmpRow["element_id"],
                                         "iam"=>$tmpRow["iam"],
                                     );
                 array_push($questions,$tmp_question);                    
             }
             // rebuild elements with questions and translations
             foreach($elements as &$_element){
                 foreach($questions as &$_question){
                     if($_element["id"] == $_question["element_id"]){
                        array_push($_element["questions"],$_question);
                        
                     }
                 }
             }
             // return as JSON for easiest parsing by REACT
             echo json_encode($elements);
             
         } else {
             echo "0 results";
         }
     } catch (\Throwable $th) {
         echo $th;
     }
     
 }
 
if($data["action"] === "GET_USER_BY_IAM"){
     $stmt = $conn->prepare("SELECT id, iam, isAdmin FROM goe_users WHERE iam = ?");
     $stmt->bind_param("s", $data["iam"]);
     try {
         $stmt->execute();
         $result = $stmt->get_result();
         if ($result->num_rows > 0) {
             // output data of each row
             $user = $result->fetch_assoc();
             echo json_encode($user);
         } else {
             echo json_encode(null);
         }
     } catch (\Throwable $th) {
         echo $th;
    }
}

// UPDATE
if($data["action"] === "UPDATE_ELEMENT"){
    
    // EXTRACT Translations From $data

    $questions = [];
    array_push($questions,$data["element"]["questionEasy"]);
    array_push($questions,$data["element"]["questionHard"]);

    foreach($questions as $question){
        // UPDATE each question
        $stmt = $conn->prepare("UPDATE goe_questions SET text_fr=?,text_de=?,text_en=?,text_lu=?, answer_fr=?, answer_de=?, answer_en=?, answer_lu=?,moreInfo_fr=?, moreInfo_de=?, moreInfo_en=?, moreInfo_lu=? WHERE id=?");
            $stmt->bind_param("ssssssssssssi",$question["text"]["fr"],
            $question["text"]["de"],
            $question["text"]["en"],
            $question["text"]["lu"],
            $question["answer"]["fr"],
            $question["answer"]["de"],
            $question["answer"]["en"],
            $question["answer"]["lu"],
            $question["moreInfo"]["fr"],
            $question["moreInfo"]["de"],
            $question["moreInfo"]["en"],
            $question["moreInfo"]["lu"],
            $question["id"]
        );
        $stmt->execute();
            
    } 
    // UPDATE EXPERIMENT IF ANY
    if(isset($data["element"]["experiment"])){
        $experiment = $data["element"]["experiment"];
        $stmt = $conn->prepare("UPDATE goe_experiments SET setup_fr=?,setup_de=?,setup_en=?,setup_lu=?, explanation_fr=?, explanation_de=?, explanation_en=?, explanation_lu=? WHERE id=?");
        $stmt->bind_param(
            "ssssssssi",
            $experiment["setup"]["fr"],
            $experiment["setup"]["de"],
            $experiment["setup"]["en"],
            $experiment["setup"]["lu"],
            $experiment["explanation"]["fr"],
            $experiment["explanation"]["de"],
            $experiment["explanation"]["en"],
            $experiment["explanation"]["lu"],
            $experiment["id"]
        );
        $stmt->execute();
    };

    // Extract element data
    $element = $data["element"];
    // UPDATE element
    $stmt = $conn->prepare("UPDATE goe_elements SET position=?, name=?, symbol=?, atomicNumber=?, color=? WHERE id=?");
    $stmt->bind_param("sssisi",$element["position"],$element["name"],$element["symbol"],$element["atomicNumber"],$element["color"],$element["id"]);
    $stmt->execute();
}

// DELETE

// Close connection    
$conn->close();



?>