import AdminLayoutWrapper from "@/components/AdminLayoutWrapper";
import LoadingProgress from "@/components/LoadingProgress"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayoutWrapper showHeaderFooter={true}>
      <LoadingProgress />
      {children}
    </AdminLayoutWrapper>
  );
} 