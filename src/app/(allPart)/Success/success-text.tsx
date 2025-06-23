import "./style.css";
import React from 'react';

interface SuccessProps {
  text: string;
}

const Success: React.FC<SuccessProps> = ({ text }) => {
  return <p className="success-text">{text}</p>;
};

export default Success;