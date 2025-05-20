-- AddForeignKey
ALTER TABLE "practices" ADD CONSTRAINT "practices_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
