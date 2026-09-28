import { useQuery } from '@tanstack/react-query';
import { profileQueries } from './queries';

export function useMyProfile() {
  return useQuery(profileQueries.me());
}
