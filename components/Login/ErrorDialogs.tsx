"use client";

import { Dispatch, SetStateAction, FC } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ErrorDialogsProps {
  isAppleClicked: boolean;
  setIsAppleClicked: Dispatch<SetStateAction<boolean>>;
  isGoogleClicked: boolean;
  setIsGoogleClicked: Dispatch<SetStateAction<boolean>>;
  isMetaClicked: boolean;
  setIsMetaClicked: Dispatch<SetStateAction<boolean>>;
  isForgotPassword: boolean;
  setIsForgotPassword: Dispatch<SetStateAction<boolean>>;
}

const ErrorDialogs: FC<ErrorDialogsProps> = ({
  isAppleClicked,
  setIsAppleClicked,
  isGoogleClicked,
  setIsGoogleClicked,
  isMetaClicked,
  setIsMetaClicked,
  isForgotPassword,
  setIsForgotPassword,
}) => {
  return (
    <div>
      {isForgotPassword && (
        <Dialog
          open={isForgotPassword}
          onOpenChange={() => setIsForgotPassword(false)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Forgot your password?</DialogTitle>
              <DialogDescription>
                Then you&apos;re an absolute moron. I&apos;m not joking here,
                you really are. You forgot your password. I don&apos;t know what
                to tell you, but you&apos;re a moron. You should have remembered
                your password. Now you&apos;re going to have to reset it
                somehow. Good luck with that, moron.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      {isAppleClicked && (
        <Dialog
          open={isAppleClicked}
          onOpenChange={() => setIsAppleClicked(false)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bro lmao</DialogTitle>
              <DialogDescription>
                you really though i&apos;d implement apple login? fr fuck off
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      {isGoogleClicked && (
        <Dialog
          open={isGoogleClicked}
          onOpenChange={() => setIsGoogleClicked(false)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>I admit</DialogTitle>
              <DialogDescription>
                That would have been nice. but... just use yout fkn email and
                password. It&apos;s really not that hard you moron.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      {isMetaClicked && (
        <Dialog
          open={isMetaClicked}
          onOpenChange={() => setIsMetaClicked(false)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                At that point you&apos;ve got to be joking
              </DialogTitle>
              <DialogDescription>
                Did you really think this btn would work? I mean who connects
                with their facebook account anyway? What are you a fucking
                Dinosaur ?
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ErrorDialogs;
