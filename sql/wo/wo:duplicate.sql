insert into public.wo
(wo_jsonb)
values ($1::jsonb - '{wo_updated,wo_updatedby,wo_deliverydate,wo_einvoice,wo_shippinglist}'::text[])
returning wo_id;