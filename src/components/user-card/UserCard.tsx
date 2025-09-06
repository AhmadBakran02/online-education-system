"use client";
import Image from "next/image";
import "./style.css";
import { useState } from "react";
import Loading4 from "../loading4/Loading4";
import Cookies from "js-cookie";
import { apiUrl } from "../url";
import SuccessCard from "../success-card/SuccessCard";
import ModalPortal from "../ModalPortal";

interface Params {
  name: string;
  email: string;
  role: string;
  gender: string;
  photoID: string;
  userID: string;
}

export default function UserCard({
  name,
  email,
  role,
  gender,
  photoID,
  userID,
}: Params) {
  function isValidUrl(string: string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  const [showUser, setShowUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [newRole, setNewRole] = useState<string>(role.toLocaleLowerCase());

  const handleChangeRole = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl + `/user/change/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: Cookies.get("token") || "",
        },
        body: JSON.stringify({
          newRole: newRole,
          userID: userID,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      // const data = await response.json();
      // console.log("File uploaded successfully!")
      setLoading(false);
      setSuccess(true);
      setShowUser(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleShowUser = () => {
    if (showUser) setShowUser(false);
    else setShowUser(true);
  };

  return (
    <div>
      <div className="user-card" onClick={handleShowUser}>
        <div className="user-image w-32 h-32 rounded-full overflow-hidden">
          <Image
            className="w-full h-full object-cover"
            src={photoID && isValidUrl(photoID) ? photoID : "/user.svg"}
            alt={""}
            width={100}
            height={100}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/pic2.jpg";
            }}
          />
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Name:
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                {name}
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Role:
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                {role}
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Email:
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                {email}
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                User ID:
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                {userID}
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Gender:
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                {gender}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {showUser && (
        <div className="modal-overlay">
          <div className="flow-card">
            <button className="close-button-card" onClick={handleShowUser}>
              <Image src={"/close.svg"} alt="" height={20} width={20} />
            </button>
            <div className="user-image w-32 h-32 rounded-full overflow-hidden">
              <Image
                className="w-full h-full object-cover"
                src={
                  photoID && isValidUrl(photoID) ? photoID : "/images/pic2.jpg"
                }
                alt={""}
                width={100}
                height={100}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/pic2.jpg";
                }}
              />
            </div>

            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Name:
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                    {name}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Role:
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* {role} */}
                    <select
                      name=""
                      id=""
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                    >
                      <option value="admin">Admin</option>
                      <option value="teacher">Teacher</option>
                      <option value="student">Student</option>
                    </select>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Email:
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                    {email}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    User ID:
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                    {userID}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Gender:
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                    {gender}
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              className="mt-4 change-role-button"
              onClick={handleChangeRole}
            >
              {loading ? (
                <div className="mt-1">
                  <Loading4 />
                </div>
              ) : (
                "Apply Changes"
              )}
            </button>
          </div>
        </div>
      )}

      {success && (
        <ModalPortal>
          <SuccessCard
            text="Changed Successfully"
            onClose={() => setSuccess(false)}
            duration={3000} // 3 seconds
          />
        </ModalPortal>
      )}
    </div>
  );
}
