import { useState } from 'react';
import { auth } from '../../utils/firebase';
import { updateProfile, updateEmail } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { USER_AVATAR } from '../../utils/constants';
import { FaCamera } from 'react-icons/fa';
import FormInput from '../common/FormInput';

const Profile = () => {
    const user = auth.currentUser;
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.displayName || '',
        email: user?.email || '',
        photoURL: user?.photoURL || USER_AVATAR
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
        setFormData(prev => ({
            ...prev,
                    photoURL: reader.result
            }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
                await updateProfile(auth.currentUser, {
                displayName: formData.name,
                photoURL: formData.photoURL
            });
                        await updateEmail(auth.currentUser, formData.email);
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.message);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
            setFormData({
            name: user?.displayName || '',
                email: user?.email || '',
            photoURL: user?.photoURL || USER_AVATAR
            });
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Profile</h1>
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                                <img 
                                src={formData.photoURL}
                                    alt="Profile" 
                                className="w-32 h-32 rounded-full object-cover"
                                />
                            {isEditing && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <label className="cursor-pointer">
                                        <FaCamera className="text-white text-2xl" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            )}
                        </div>
                        <h2 className="text-xl font-semibold mt-4">{formData.name}</h2>
                        <p className="text-gray-600">{formData.email}</p>
                    </div>
                    <div className="flex-1">
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                                            <FormInput
                                label="Name"
                                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={!isEditing}
                                            />
                                            <FormInput
                                                label="Email"
                                                type="email"
                                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                disabled={!isEditing}
                                                />
                            <div className="flex gap-4 mt-6">
                                {!isEditing ? (
                                                <button
                                                    type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Edit Profile
                                                </button>
                                ) : (
                                    <>
                                                    <button
                                                        type="submit"
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                        >
                                                                Save Changes
                                                    </button>
                                                <button
                                                    type="button"
                                            onClick={handleCancel}
                                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                                                >
                                                    Cancel
                                                </button>
                                                            </>
                                                        )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 