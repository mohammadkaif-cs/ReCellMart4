import React from 'react';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/data/dashboard';
import { User } from 'firebase/auth';
import { Edit, ShieldCheck, Phone, MapPin, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ProfileDisplayProps {
  userProfile: UserProfile | null;
  currentUser: User | null;
  onEdit: () => void;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ userProfile, currentUser, onEdit }) => {
  if (!userProfile) {
    return <p className="text-muted-foreground">No profile data found.</p>;
  }

  const userInitial = userProfile.name?.[0]?.toUpperCase() || userProfile.email?.[0]?.toUpperCase() || '?';
  const fullAddress = [
    userProfile.addressLine1,
    userProfile.addressLine2,
    userProfile.city,
    userProfile.pincode,
  ].filter(Boolean).join(', ');
  const registrationDate = currentUser?.metadata.creationTime 
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24 border-4 border-primary/20">
          <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
          <AvatarFallback className="text-3xl bg-secondary">{userInitial}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">{userProfile.name || 'New User'}</h2>
          <p className="text-muted-foreground">{userProfile.email}</p>
          <Badge variant="outline" className="mt-2 capitalize">
            <ShieldCheck className="mr-1 h-3 w-3" /> {userProfile.role}
          </Badge>
        </div>
      </div>

      <div className="space-y-4 text-lg">
        <div className="flex items-center gap-4 p-3 bg-secondary/30 rounded-lg">
          <Phone className="h-6 w-6 text-primary/80 flex-shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="text-foreground font-medium">{userProfile.phone || 'Not set'}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-3 bg-secondary/30 rounded-lg">
          <MapPin className="h-6 w-6 text-primary/80 flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="text-foreground font-medium">{fullAddress || 'Not set'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-3 bg-secondary/30 rounded-lg">
          <Calendar className="h-6 w-6 text-primary/80 flex-shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground">Registration Date</p>
            <p className="text-foreground font-medium">{registrationDate}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button onClick={onEdit} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-shadow hover-glow">
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileDisplay;