import SignupModal from './SignupModal';

type SignupGateProps = {
  visible: boolean;
  onSuccess: () => void;
};

/**
 * SignupGate is a blocking modal that prevents users from continuing
 * after they've completed their first flow without signing up.
 */
export default function SignupGate({ visible, onSuccess }: SignupGateProps) {
  return (
    <SignupModal
      visible={visible}
      onClose={() => {}} // No-op - can't dismiss gate
      onSuccess={onSuccess}
      mode="gate"
    />
  );
}
