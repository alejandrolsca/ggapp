delete from client;
delete from ink;
delete from machine;
delete from material;
delete from product;
delete from supplier;
delete from wo;
delete from zone;

alter sequence seq_client_cl_id restart;
alter sequence seq_ink_in_id restart;
alter sequence seq_machine_ma_id restart;
alter sequence seq_material_mt_id restart;
alter sequence seq_product_pr_id restart;
alter sequence seq_supplier_su_id restart;
alter sequence seq_wo_wo_id restart;
alter sequence seq_zone_zo_id restart;