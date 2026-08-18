"use client";

import { useModal } from "@/context/ModalContext";
import LoginModal from "./LoginModal";
import RewardModal from "./RewardModal";
import ProfileModel from "./ProfileModal";
import PersonalCenterModal from "./PersonalCenterModal";

const MODALS = {
  login: LoginModal,
  profile: ProfileModel,
  reward: RewardModal,
  "পুরস্কার কেন্দ্র": PersonalCenterModal,
  "ম্যানুয়াল রিবেট": PersonalCenterModal,
  "আমার অ্যাকাউন্ট": PersonalCenterModal,
  "বন্ধুদের আমন্ত্রণ": PersonalCenterModal,
  "বিনিয়োগ পরিকল্পনা": PersonalCenterModal,
  মিশন: PersonalCenterModal,
  ডিপোজিট: PersonalCenterModal,
  উত্তোলন: PersonalCenterModal,
  "বেটিং রেকর্ড": PersonalCenterModal,
  "অ্যাকাউন্ট রেকর্ড": PersonalCenterModal,
  "অভ্যন্তরীণ বার্তা": PersonalCenterModal,
  "লাভ ও ক্ষতি": PersonalCenterModal,
};

export default function ModalRoot() {
  const { activeModal, closeModal } = useModal();
  if (!activeModal) return null;
  const ActiveModal = MODALS[activeModal];
  if (!ActiveModal) return null;
  const props = { initialTab: activeModal };

  return <ActiveModal open={true} onClose={closeModal} {...props} />;
}
