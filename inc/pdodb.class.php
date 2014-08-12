<?php
class PDODB {
	private $dbtype;
	private $host;
	private $port;
    private $user;
    private $pass;
    private $dbname;
	
    private $db;
	private $query;
	private $stmt;
    private $result;
	private $connected;
	
	public function __construct($dbtype, $host , $port, $user, $pass, $dbname) {
		$this->dbtype = $dbtype;
		$this->host   = $host;
		$this->port   = $port;
		$this->user   = $user;
		$this->pass   = $pass;
		$this->dbname = $dbname;
		$this->connect();
	}
	
	protected function connect() {
		if($this->connected != true) {
			// Set DSN
			$dsn = $this->dbtype . ":host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->dbname;
			// Set options
			$options = array(
				PDO::ATTR_PERSISTENT			=> false,
				PDO::ATTR_ERRMODE				=> PDO::ERRMODE_EXCEPTION,
				PDO::MYSQL_ATTR_INIT_COMMAND	=> "SET NAMES 'UTF8'"
			);
			// Create a new PDO instanace
			try{
				$this->db = new PDO($dsn, $this->user, $this->pass, $options);
				$this->connected = true;
			}
			// Catch any errors
			catch(PDOException $exception){
				$log = new Log();
				$error = $exception->getMessage();
				$errorCode = $exception->getCode();
				$log->connectionError($errorCode, $error);
				exit('Error de conexion.');
			}
		}
	}
	public function disconnect() {
		if($this->connected == true) {
			$this->db = null;
			$this->connected = false;
		}
	}
	public function newStmt() {
		$this->connect();
		if(is_object($this->stmt)) {
			$this->stmt = null;
		}
    }
	public function prepare($query){
		// Save query in local variable
		$this->query = $query;
		// Create new stmt
		$this->newStmt();
		// Prepare the stmt
		$this->stmt = $this->db->prepare($query);
		return $this;
	}
	public function bindValue($param, $value, $type = null){
		if (is_null($type)) {
			switch (true) {
				case is_int($value):
					$type = PDO::PARAM_INT;
					break;
				case is_bool($value):
					$type = PDO::PARAM_BOOL;
					break;
				case is_null($value):
					$type = PDO::PARAM_NULL;
					break;
				default:
					$type = PDO::PARAM_STR;
			}
		}
		$this->stmt->bindValue($param, $value, $type);
		return $this;
	}
	public function execute(){
		// Executes the query
		try {
			$this->stmt->execute();
			return $this;
		}
		// Catch any errors
		catch(PDOException $exception){
			$log = new Log();
			$error = $exception->getMessage();
			$log->queryError($this->query, $error);
			if (preg_match("/duplicate/i", $error)) {
				exit('{"msg":"Los datos estan duplicados."}');
			} else {
				exit('{"msg":"Error al ejecutar el query."}');
			}
		} 
	}
	public function fetch(){
		return $this->stmt->fetch(PDO::FETCH_ASSOC);
	}
	public function fetchAll(){
		return $this->stmt->fetchAll(PDO::FETCH_ASSOC);
	}
	public function rowCount(){
		return $this->stmt->rowCount();
	}
	public function lastInsertId(){
		return $this->db->lastInsertId();
	}
	public function beginTransaction(){
		return $this->db->beginTransaction();
	}
	public function rollBack(){
		return $this->db->rollBack();
	}
	public function commit(){
		return $this->db->commit();
	}
	public function debugDumpParams(){
		return $this->stmt->debugDumpParams();
	}
}