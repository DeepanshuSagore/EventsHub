export const ClerkProvider = ({ children }) => children;
export const SignedIn = ({ children }) => children;
export const SignedOut = ({ children }) => null;
export const SignInButton = ({ children }) => children ?? null;
export const UserButton = () => null;
export const useUser = () => ({ isSignedIn: false, user: null });

export function AppAuthProvider({ publishableKey, children }) {
  if (GUEST_MODE) {
    return <>{children}</>;
  }

  return (
    <ClerkProviderBase publishableKey={publishableKey}>{children}</ClerkProviderBase>
  );
}

export function SignedIn({ children }) {
  if (GUEST_MODE) {
    return <>{children}</>;
  }

  return <ClerkSignedIn>{children}</ClerkSignedIn>;
}

export function SignedOut({ children }) {
  if (GUEST_MODE) {
    return null;
  }

  return <ClerkSignedOut>{children}</ClerkSignedOut>;
}

function handleGuestSignInClick(event, originalHandler) {
  if (typeof originalHandler === 'function') {
    originalHandler(event);
  }

  if (!event.defaultPrevented) {
    window.alert('Sign-in is disabled while guest mode is active. Set VITE_ENABLE_GUEST_MODE=false and restart to enable Clerk.');
  }
}

export function SignInButton({ children, ...rest }) {
  if (!GUEST_MODE) {
    return <ClerkSignInButton {...rest}>{children}</ClerkSignInButton>;
  }

  if (!children) {
    return (
      <button
        type="button"
        className="btn btn--primary btn--sm"
        onClick={(event) => handleGuestSignInClick(event)}
      >
        Sign In
      </button>
    );
  }

  const child = React.Children.only(children);

  return React.cloneElement(child, {
    onClick: (event) => handleGuestSignInClick(event, child.props.onClick)
  });
}

export function UserButton(props) {
  if (!GUEST_MODE) {
    return <ClerkUserButton {...props} />;
  }

  return (
    <div className="user-button user-button--guest" role="img" aria-label="Guest user">
      <span className="user-button__avatar">👤</span>
    </div>
  );
}

export function useUser() {
  if (GUEST_MODE) {
    return {
      isSignedIn: true,
      isLoaded: true,
      user: GUEST_USER
    };
  }

  return clerkUseUser();
}
