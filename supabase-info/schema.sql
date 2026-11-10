-- KDOL: cấu trúc được chép từ ảnh Supabase người dùng cung cấp ngày 2026-11-10.
-- Đây là bản ghi tham khảo, chưa được thực thi trên database.
-- Ảnh chưa cung cấp RLS, policies, grants, triggers hoặc các index ngoài khóa chính.

create table public.categories (
    id text not null,
    name text not null,
    sort_order integer null default 0,
    constraint categories_pkey primary key (id)
) TABLESPACE pg_default;

create table public.services (
    id text not null,
    category_id text null,
    name text not null,
    sort_order integer null default 0,
    constraint services_pkey primary key (id),
    constraint services_category_id_fkey foreign key (category_id)
        references categories (id) on delete cascade
) TABLESPACE pg_default;

create table public.plans (
    id uuid not null default gen_random_uuid(),
    service_id text null,
    plan_group text null,
    group_name text null,
    duration_text text null,
    price bigint not null,
    note text null,
    invoice_price bigint null,
    constraint plans_pkey primary key (id)
) TABLESPACE pg_default;
