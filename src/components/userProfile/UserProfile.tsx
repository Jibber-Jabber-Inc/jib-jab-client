import { useParams } from "react-router-dom";
import { useUserInfoById } from "../../api/users";

export const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading } = useUserInfoById(id);

  if (isLoading) return <h4>loading...</h4>;
  if (!user) return <h4>Error</h4>;

  return (
    <div>
      <div>{user.firstName}</div>
      <div>{user.lastName}</div>
      <div>{user.username}</div>
    </div>
  );
};
