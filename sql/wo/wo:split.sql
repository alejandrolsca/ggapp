insert into public.wo
(wo_jsonb)
values ($1::jsonb - '{wo_updatedby,wo_deliverydate,wo_exportationinvoice,wo_shippinglist,wo_cancellationnotes,wo_qtydone,wo_originalqty,wo_originalfoliosfrom}'::text[])
returning wo_id, wo_jsonb, wo_date, wo_lastupdated;