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

}
if($data["action"] === "INSERT_QUESTION"){
    // INSERT QUESTION FOR SPECIFIC ELEMENT
    $stmt = $conn->prepare("INSERT INTO goe_questions (`id`,`isDefault`,`difficulty`,`text_fr`,`text_de`,`text_en`,`answer_fr`,`answer_de`,`answer_en`,`element_id`,`user_id`,`moreInfo_fr`,`moreInfo_en`,`moreInfo_de`)
    VALUES (0,?,?,?,?,?,?,?,?,?,?,?,?,?)");
    $stmt->bind_param("isssssssiisss",
        $data["question"]["isDefault"],
        $data["question"]["difficulty"],
        $data["question"]["text"]["fr"],
        $data["question"]["text"]["de"],
        $data["question"]["text"]["en"],
        $data["question"]["answer"]["fr"],
        $data["question"]["answer"]["de"],
        $data["question"]["answer"]["en"],
        $data["question"]["element_id"],
        $data["user_id"],
        $data["question"]["moreInfo"]["fr"],
        $data["question"]["moreInfo"]["en"],
        $data["question"]["moreInfo"]["de"],
    );
    try {
        $stmt->execute();
        $questionId = $stmt->insert_id;
        echo json_encode(array("question_id"=>$questionId));
    } catch (\Throwable $th) {
        echo $th;
    }
}

if($data["action"] === "INSERT_EXPERIMENT"){
    // INSERT EXPERIMENT FOR SPECIFIC ELEMENT
    $stmt = $conn->prepare("INSERT INTO goe_experiments (`id`,`element_id`,`question_fr`,`question_de`,`question_en`,`answer_fr`,`answer_de`,`answer_en`,`moreInfo_fr`,`moreInfo_de`,`moreInfo_en`)
    VALUES (0,?,?,?,?,?,?,?,?,?,?)");
    $stmt->bind_param("isssssssss",
        $data["experiment"]["element_id"],
        $data["experiment"]["question"]["fr"],
        $data["experiment"]["question"]["de"],
        $data["experiment"]["question"]["en"],
        $data["experiment"]["answer"]["fr"],
        $data["experiment"]["answer"]["de"],
        $data["experiment"]["answer"]["en"],
        $data["experiment"]["moreInfo"]["fr"],
        $data["experiment"]["moreInfo"]["de"],
        $data["experiment"]["moreInfo"]["en"]
    );
    try {
        $stmt->execute();
        $experimentId = $stmt->insert_id;
        echo json_encode(array("experiment_id"=>$experimentId));
    } catch (\Throwable $th) {
        echo $th;
    }
   
}
/* 
INSERT INTO `goe_elements` (`id`, `position`, `name`, `symbol`, `atomicNumber`, `color`) VALUES (NULL, '50-0', 'Caesium', 'Cs', '55', 'color1');
INSERT INTO `goe_questions` (`id`, `isDefault`, `difficulty`, `text_fr`, `text_de`, `text_en`, `text_lu`, `answer_fr`, `answer_de`, `answer_en`, `answer_lu`, `element_id`, `user_id`, `moreInfo_fr`, `moreInfo_en`, `moreInfo_de`, `moreInfo_lu`) VALUES (NULL, '1', 'easy', '', '', '', '', '', '', '', '', '55', NULL, '', '', '', '');
*/

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
     q.text_fr as q_text_fr,
     q.text_en as q_text_en,
     q.text_de as q_text_de,
     q.answer_fr as q_answer_fr,
     q.answer_en as q_answer_en,
     q.answer_de as q_answer_de,
     q.moreInfo_fr as q_moreInfo_fr,
     q.moreInfo_en as q_moreInfo_en,
     q.moreInfo_de as q_moreInfo_de,
     ex.id as experiment_id,
     ex.question_fr as ex_question_fr,
     ex.question_en as ex_question_en,
     ex.question_de as ex_question_de,
     ex.answer_fr as ex_answer_fr,
     ex.answer_en as ex_answer_en,
     ex.answer_de as ex_answer_de,
     ex.moreInfo_fr as ex_moreInfo_fr,
     ex.moreInfo_en as ex_moreInfo_en,
     ex.moreInfo_de as ex_moreInfo_de
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
                 $tmpRow = array(
                                "element_id"=>$row["element_id"],
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
                                "q_text_fr"=>$row["q_text_fr"],
                                "q_text_en"=>$row["q_text_en"],
                                "q_text_de"=>$row["q_text_de"],
                                "q_answer_fr"=>$row["q_answer_fr"],
                                "q_answer_en"=>$row["q_answer_en"],
                                "q_answer_de"=>$row["q_answer_de"],
                                "q_moreInfo_fr"=>$row["q_moreInfo_fr"],
                                "q_moreInfo_en"=>$row["q_moreInfo_en"],
                                "q_moreInfo_de"=>$row["q_moreInfo_de"],
                                "ex_question_fr"=>$row["ex_question_fr"],
                                "ex_question_en"=>$row["ex_question_en"],
                                "ex_question_de"=>$row["ex_question_de"],
                                "ex_answer_fr"=>$row["ex_answer_fr"],
                                "ex_answer_en"=>$row["ex_answer_en"],
                                "ex_answer_de"=>$row["ex_answer_de"],
                                "ex_moreInfo_fr"=>$row["ex_moreInfo_fr"],
                                "ex_moreInfo_en"=>$row["ex_moreInfo_en"],
                                "ex_moreInfo_de"=>$row["ex_moreInfo_de"],
                                );
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
                                         "experiment"=> null,
                                         );
                        // add experiment if any
                        if($tmpRow["experiment_id"] != null){
                            $tmp_element["experiment"] = array(
                                "id"=>$tmpRow["experiment_id"],
                                "question"=>[
                                    "fr"=>$tmpRow["ex_question_fr"],
                                    "en"=>$tmpRow["ex_question_en"],
                                    "de"=>$tmpRow["ex_question_de"],
                                ],
                                "answer"=>[
                                    "fr"=>$tmpRow["ex_answer_fr"],
                                    "en"=>$tmpRow["ex_answer_en"],
                                    "de"=>$tmpRow["ex_answer_de"],
                                ],
                                "moreInfo"=>[
                                    "fr"=>$tmpRow["ex_moreInfo_fr"],
                                    "en"=>$tmpRow["ex_moreInfo_en"],
                                    "de"=>$tmpRow["ex_moreInfo_de"],
                                ],
                            );
                        }
                     array_push($elements,$tmp_element);
                 }
                 
                 $tmp_question = array(  "id"=>$tmpRow["question_id"],
                                         "isDefault"=>$tmpRow["isDefault"],
                                         "difficulty"=>$tmpRow["difficulty"],
                                         "text"=>[
                                             "fr"=>$tmpRow["q_text_fr"],
                                             "en"=>$tmpRow["q_text_en"],
                                             "de"=>$tmpRow["q_text_de"],
                                         ],
                                         "answer"=>[
                                             "fr"=>$tmpRow["q_answer_fr"],
                                             "en"=>$tmpRow["q_answer_en"],
                                             "de"=>$tmpRow["q_answer_de"],
                                         ],
                                         "moreInfo"=>[
                                             "fr"=>$tmpRow["q_moreInfo_fr"],
                                             "en"=>$tmpRow["q_moreInfo_en"],
                                             "de"=>$tmpRow["q_moreInfo_de"],
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
    try{
        foreach($questions as $question){
            // UPDATE each question
            $stmt = $conn->prepare("UPDATE goe_questions SET text_fr=?,text_de=?,text_en=?, answer_fr=?, answer_de=?, answer_en=?,moreInfo_fr=?, moreInfo_de=?, moreInfo_en=? WHERE id=?");
                $stmt->bind_param("sssssssssi",
                $question["text"]["fr"],
                $question["text"]["de"],
                $question["text"]["en"],
                $question["answer"]["fr"],
                $question["answer"]["de"],
                $question["answer"]["en"],
                $question["moreInfo"]["fr"],
                $question["moreInfo"]["de"],
                $question["moreInfo"]["en"],
                $question["id"]
            );
            $stmt->execute();
                
        } 
    
        
        // UPDATE EXPERIMENT IF ANY
        if(isset($data["element"]["experiment"])){
            $experiment = $data["element"]["experiment"];
            $stmt = $conn->prepare("UPDATE goe_experiments SET question_fr=?,question_de=?,question_en=?, answer_fr=?, answer_de=?, answer_en=?, moreInfo_fr=?, moreInfo_de=?, moreInfo_en=? WHERE id=?");
            $stmt->bind_param(
                "sssssssssi",
                $experiment["question"]["fr"],
                $experiment["question"]["de"],
                $experiment["question"]["en"],
                $experiment["answer"]["fr"],
                $experiment["answer"]["de"],
                $experiment["answer"]["en"],
                $experiment["moreInfo"]["fr"],
                $experiment["moreInfo"]["de"],
                $experiment["moreInfo"]["en"],
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
    } catch (\Throwable $th) {
        echo $th;
    }
    
    
}

// DELETE

// Close connection    
$conn->close();



?>