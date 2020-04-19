insert into public.wo
(wo_jsonb)
values ($1::jsonb - '{wo_updatedby,wo_deliverydate,wo_exportationinvoice,wo_shippinglist,wo_cancellationnotes,wo_originalqty,wo_originalfoliosfrom}'::text[])
returning wo_id;