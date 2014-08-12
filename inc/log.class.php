<?php
class Log {
	
	public function connectionError($errorno, $error) { 
		$date = date("Y-m-d H:i:s"); 
		$log = "Connection Error #: ".$errorno."\n | Error: ".$error."\n | Date: ".$date. "\n"; 
		if (!is_dir(LOG_DIR)) {
			mkdir(LOG_DIR,0777,true);	
		}
		if (!file_exists(LOG_DIR.'/'.LOG_FILE)) {
			touch (LOG_DIR.'/'.LOG_FILE);
			chmod(LOG_DIR.'/'.LOG_FILE,0777);
		}
		error_log($log, 3, LOG_DIR.'/'.LOG_FILE); 
    } 
	
    public function queryError($query, $error) { 
		$date = date("Y-m-d H:i:s"); 
		$log = "Query: ".$query."\n | Error: ".$error."\n | Date: ".$date. "\n";
		if (!is_dir(LOG_DIR)) {
			mkdir(LOG_DIR,0777,true);	
		}
		if (!file_exists(LOG_DIR.'/'.LOG_FILE)) {
			touch (LOG_DIR.'/'.LOG_FILE);
			chmod(LOG_DIR.'/'.LOG_FILE,0777);
		}
		error_log($log, 3, LOG_DIR.'/'.LOG_FILE); 
    } 	
}
?>