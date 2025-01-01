import { useState, type ReactNode } from 'react';
import invariant from 'tiny-invariant';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveLoggedInUsername } from '@/lib/actions';
import { userQueryOptions } from '@/lib/user-query-options';

export function UsernameEditorDialog({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data: myUsername, isLoading: isLoadingMyUsername } =
    useQuery(userQueryOptions);

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  if (!isLoadingMyUsername && !myUsername && !isOpen) {
    setIsOpen(true);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const newUsername = formData.get('username');
    invariant(
      typeof newUsername === 'string',
      'Expected username to be a string'
    );

    setIsSubmitting(true);
    try {
      await saveLoggedInUsername(newUsername);
      queryClient.invalidateQueries({ queryKey: userQueryOptions.queryKey });
      setIsOpen(false);
      setError(undefined);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-neutral-500">Edit profile</DialogTitle>
          <DialogDescription>
            Edit your profile information here. This information will be visible
            to other users.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right text-neutral-500">
                Username
              </Label>
              <Input
                key={myUsername}
                id="username"
                className="col-span-3"
                name="username"
                defaultValue={myUsername ?? ''}
              />
            </div>
            {error && (
              <div className="col-span-4 text-red-500 text-sm">{error}</div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
