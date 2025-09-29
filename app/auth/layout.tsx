const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FBF3B9] to-[#FFEFC8]">
      {children}
    </div>
  );
};

export default AuthLayout;
