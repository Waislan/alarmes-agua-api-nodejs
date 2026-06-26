-- Extensão necessária para uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "agua"."users" (
    "id" UUID NOT NULL DEFAULT public.uuid_generate_v4(),
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(60) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agua"."refresh_tokens" (
    "id" UUID NOT NULL DEFAULT public.uuid_generate_v4(),
    "token" VARCHAR(128) NOT NULL,
    "user_id" UUID NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agua"."products" (
    "id" UUID NOT NULL DEFAULT public.uuid_generate_v4(),
    "name" VARCHAR(100) NOT NULL,
    "style" VARCHAR(100) NOT NULL,
    "resume" VARCHAR(1000),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agua"."sensors" (
    "id" UUID NOT NULL DEFAULT public.uuid_generate_v4(),
    "product_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "algorithm" VARCHAR(100) NOT NULL,
    "resolution" INTEGER NOT NULL,
    "frequency" VARCHAR(50) NOT NULL,
    "unit" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "sensors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agua"."logs" (
    "id" UUID NOT NULL DEFAULT public.uuid_generate_v4(),
    "sensor_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "detected_date" DATE NOT NULL,
    "source_code" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "agua"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "agua"."refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "products_style_key" ON "agua"."products"("style");

-- CreateIndex
CREATE UNIQUE INDEX "sensors_product_id_name_key" ON "agua"."sensors"("product_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "logs_sensor_id_detected_date_key" ON "agua"."logs"("sensor_id", "detected_date");

-- AddForeignKey
ALTER TABLE "agua"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "agua"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agua"."sensors" ADD CONSTRAINT "sensors_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "agua"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agua"."logs" ADD CONSTRAINT "logs_sensor_id_fkey" FOREIGN KEY ("sensor_id") REFERENCES "agua"."sensors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agua"."logs" ADD CONSTRAINT "logs_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "agua"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
