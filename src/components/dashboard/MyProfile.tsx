import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db, storage } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Loader2 } from 'lucide-react';
import ProfileDisplay from './ProfileDisplay';
import ProfileForm, { ProfileFormValues } from './ProfileForm';

const MyProfile: React.FC = () => {
  const { currentUser, userProfile, loadingProfile, refreshUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (values: ProfileFormValues, imageFile: File | null) => {
    if (!currentUser || !userProfile) {
      toast.error('You must be logged in to update your profile.');
      return;
    }
    const loadingToast = toast.loading('Saving profile...');
    try {
      let avatarUrl = userProfile.avatarUrl || '';

      if (imageFile) {
        const storageRef = ref(storage, `profile-pictures/${currentUser.uid}`);
        const uploadResult = await uploadBytes(storageRef, imageFile);
        avatarUrl = await getDownloadURL(uploadResult.ref);
      }

      const profileDataToSave = {
        ...userProfile,
        ...values,
        avatarUrl,
        email: currentUser.email,
        profileCompleted: true,
        role: userProfile.role || 'user',
      };
      await setDoc(doc(db, 'users', currentUser.uid), profileDataToSave, { merge: true });
      await refreshUserProfile();
      toast.success('Profile updated successfully!', { id: loadingToast });
      setIsEditing(false);
    } catch (error: any)      {
      console.error('Error updating profile:', error);
      const errorMessage = error.message || 'An unknown error occurred. Please try again.';
      toast.error(`Failed to update profile: ${errorMessage}`, { id: loadingToast });
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-card border-primary/20 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-primary">My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">Could not load profile data. Please try refreshing the page or contact support.</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const shouldShowForm = isEditing || !userProfile.profileCompleted;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-card border-primary/20 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-primary">{shouldShowForm ? 'Complete Your Profile' : 'My Profile'}</CardTitle>
        </CardHeader>
        <CardContent>
          {shouldShowForm ? (
            <ProfileForm 
              onSave={handleSave} 
              onCancel={() => setIsEditing(false)}
              isCancellable={userProfile.profileCompleted}
            />
          ) : (
            <ProfileDisplay userProfile={userProfile} currentUser={currentUser} onEdit={() => setIsEditing(true)} />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MyProfile;