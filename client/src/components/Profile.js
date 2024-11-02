import React from "react";
const Profile = ({ userId, name, tag, onLike }) => {
    return (React.createElement("div", { className: "profile-card" },
        React.createElement("h2", null, name),
        React.createElement("p", null,
            "Tag: ",
            tag),
        React.createElement("button", { onClick: () => onLike(userId) }, "Like")));
};
export default Profile;
//# sourceMappingURL=Profile.js.map