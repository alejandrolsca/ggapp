<?php
if (!isset($_SESSION)) {
  session_start();
}
$authorizedUsers = $authorizedUsers;
$donotCheckaccess = "false";

// *** Restrict Access To Page: Grant or deny access to this page
function isAuthorized($strUsers, $strGroups, $UserName, $UserGroup) { 
  // For security, start by assuming the visitor is NOT authorized. 
  $isValid = False; 

  // When a visitor has logged into this site, the Session variable Username set equal to their username. 
  // Therefore, we know that a user is NOT logged in if that Session variable is blank. 
  if (!empty($UserName)) { 
    // Besides being logged in, you may restrict access to only certain users based on an ID established when they login. 
    // Parse the strings into arrays. 
    $arrUsers = Explode(",", $strUsers); 
    $arrGroups = Explode(",", $strGroups); 
    if (in_array($UserName, $arrUsers)) { 
      $isValid = true; 
    } 
    // Or, you may restrict access to only certain users based on their username. 
    if (in_array($UserGroup, $arrGroups)) { 
      $isValid = true; 
    } 
    if (($strUsers == "") && false) { 
      $isValid = true; 
    } 
  } 
  return $isValid; 
}

$restrictGoTo = "../login/index.php?msg=Acceso%20denegado%2E";
if (!((isset($_SESSION['logged_user'])) && (isAuthorized("",$authorizedUsers, $_SESSION['logged_user'], $_SESSION['logged_userGroup'])))) {   
  $qsChar = "?";
  $referrer = $_SERVER['PHP_SELF'];
  if (strpos($restrictGoTo, "?")) $qsChar = "&";
  if (isset($_SERVER['QUERY_STRING']) && strlen($_SERVER['QUERY_STRING']) > 0) 
  $referrer .= "?" . $_SERVER['QUERY_STRING'];
  $restrictGoTo = $restrictGoTo. $qsChar . "accesscheck=" . urlencode($referrer);
  header("Location: ". $restrictGoTo); 
  exit;
}
?>