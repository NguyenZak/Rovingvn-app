-- Grant permissions for custom_trips table
GRANT ALL ON TABLE "public"."custom_trips" TO "anon";
GRANT ALL ON TABLE "public"."custom_trips" TO "authenticated";
GRANT ALL ON TABLE "public"."custom_trips" TO "service_role";

-- Ensure the table exists (idempotent check is good practice, but we assume it exists from previous migration)
-- If it doesn't exist, the previous migration failed.

-- Re-apply the insert policy to be sure
DROP POLICY IF EXISTS "Anyone can submit custom trip requests" ON "public"."custom_trips";
CREATE POLICY "Anyone can submit custom trip requests"
    ON "public"."custom_trips"
    FOR INSERT
    TO public
    WITH CHECK (true);
