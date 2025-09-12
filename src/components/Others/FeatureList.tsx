import React from "react";
import Feature from "./Feature";

export default function FeatureList() {
  return (
    <div className="fixed hidden right-0 mr-1 top-0 bottom-0 p-4 lg:grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto">
      <Feature
        title="Content Age Verification"
        description="Keep it safe and secure! NSFW content is locked behind 18+ ID verification, ensuring it stays out of reach for minors."
        IconClass="icon-[noto--identification-card]"
      />

      <Feature
        title="Advanced Post Privacy"
        description="Choose your audience! Set your posts to be visible only to followers, custom clubs, or share them with the public."
        IconClass="icon-[material-symbols--visibility]"
      />
      <Feature
        title="Live Post Translation"
        description="Automatically translate posts into any language of your choice and connect with a global audience effortlessly."
        IconClass="icon-[ph--translate]"
      />
      <Feature
        title="Summarize Button"
        description="Stay informed anytime, anywhere! Get a quick summary of today's or even yesterday's news, so you're always up-to-date even offline!"
        IconClass="icon-[material-symbols--short-text]"
      />
      <Feature
        title="Ephemeral Posts"
        description="Set it and forget it! With auto-delete, your posts vanish after your chosen time."
        IconClass="icon-[ic--outline-auto-delete]"
      />
      <Feature
        title="Post Ownership Transfer"
        description="Seamlessly transfer your post's ownership to another user, giving them the option to accept or decline securely!"
        IconClass="icon-[icon-park--exchange-three]"
      />
      <Feature
        title="NoSpy"
        description="Unlock ultimate privacy with the NoSpy feature your secret weapon against spies. Keep your profile secure and invisible to strangers, so you can connect confidently and stay in control!"
        IconClass="icon-[fxemoji--sleuthspy]"
      />
      <Feature
        title="Share News"
        description="Spread the word fast! Share news with varying emergency levels quickly and efficiently, ensuring the right information reaches the right people."
        IconClass="icon-[flat-color-icons--news]"
      />
    </div>
  );
}
