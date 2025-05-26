DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'inventory_service') THEN
      CREATE DATABASE inventory_service;
   END IF;

   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'discount_service') THEN
      CREATE DATABASE discount_service;
   END IF;
END
$$;
