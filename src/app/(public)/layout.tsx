import AdminLayoutWrapper from "@/components/AdminLayoutWrapper";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayoutWrapper showHeaderFooter={true}>
      {children}
    </AdminLayoutWrapper>
  );
} 