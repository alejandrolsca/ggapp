CREATE TRIGGER wo_after_update
  AFTER UPDATE
  ON wo
  FOR EACH ROW
  WHEN (pg_trigger_depth()=0)
  EXECUTE PROCEDURE wo_after_update();