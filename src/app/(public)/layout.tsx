import AdminLayoutWrapper from "@/components/AdminLayoutWrapper";
import LoadingProgress from "@/components/LoadingProgress";
import { Toaster } from "@/components/ui/sonner";
import DynamicBreadcrumb from "@/components/ui/DynamicBreadcrumb";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-center" richColors closeButton />
      <AdminLayoutWrapper showHeaderFooter={true}>
        <LoadingProgress />
        <DynamicBreadcrumb />
        {children}
      </AdminLayoutWrapper>
    </>
  );
} 