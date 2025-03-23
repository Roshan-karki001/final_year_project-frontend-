import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Mail, Phone, Briefcase, Edit, Trash2, MapPin } from "lucide-react";

const ClientProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleEdit = () => {
    // Edit profile function
  };

  const handleDelete = () => {
    fetch(`/api/users/${id}`, { method: "DELETE" })
      .then(() => alert("Profile deleted"))
      .catch((err) => console.error(err));
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{profile.F_name} {profile.L_name}</h1>
        <div className="flex gap-2">
          <button onClick={handleEdit} className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1">
            <Edit size={16} /> Edit
          </button>
          <button onClick={handleDelete} className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1">
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
      <p className="text-gray-600">{profile.businessName || "Client"}</p>
      <div className="flex gap-4 mt-3">
        <p className="flex items-center gap-1 text-gray-500"><MapPin size={16} /> {profile.location || "Not Provided"}</p>
        <p className="flex items-center gap-1 text-gray-500"><Mail size={16} /> {profile.G_mail}</p>
        <p className="flex items-center gap-1 text-gray-500"><Phone size={16} /> {profile.Phonenumber}</p>
      </div>
      <p className="mt-4 text-gray-700">{profile.bio || "No bio available."}</p>
    </div>
  );
};

export default ClientProfile;
