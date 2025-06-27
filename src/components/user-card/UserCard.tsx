import Image from "next/image";
import "./style.css";

interface Params {
  name: string;
  email: string;
  role: string;
  gender: string;
  photoID: string;
}

export default function UserCard({
  name,
  email,
  role,
  gender,
  photoID,
}: Params) {
  function isValidUrl(string: string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }
  return (
    <div className="user-card">
      <div className="user-image w-32 h-32 rounded-full overflow-hidden">
        <Image
          className="w-full h-full object-cover"
          src={photoID && isValidUrl(photoID) ? photoID : "/images/pic2.jpg"}
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
              Gender:
            </td>
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
              {gender}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
