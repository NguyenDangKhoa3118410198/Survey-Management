export const customizeRequiredMark = (
  label: React.ReactNode,
  { required }: { required: boolean }
) => (
  <>
    {label && (
      <span style={{ width: '150px', textAlign: 'left' }}>
        {label}
        {required && <span style={{ color: 'red' }}> *</span>}
      </span>
    )}
  </>
);
