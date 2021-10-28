import * as React from "react";
import styled from "styled-components";
import Avatar from "@atlaskit/avatar";

export interface TicketCardProps {
  readonly ticketNumber: number;
  readonly patient: {
    firstName: string;
    lastName: string;
  };
  readonly doctor: {
    firstName: string;
    lastName: string;
  };
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticketNumber, patient, doctor }) => {
  return (
    <CardWrapper>
      <DoctorPart>
        <Avatar size="medium" />
        <DoctorInfo>
          <DoctorName>{`Dr. ${doctor.firstName} ${doctor.lastName}`}</DoctorName>
          <DoctorSpecialty>General Practitioner</DoctorSpecialty>
        </DoctorInfo>
      </DoctorPart>
      <TicketPart>
        <TicketNumber>{("" + ticketNumber).padStart(3, "0")}</TicketNumber>
        <div className="ticket-card__patient">
          <div className="ticket-card__patient-name">
            {patient.firstName} {patient.lastName}
          </div>
        </div>
      </TicketPart>
    </CardWrapper>
  );
};

export const CardWrapper = styled.div`
  min-height: 150px;
  border: 1px solid #0747a6;
  border-radius: 28px;
  padding: 20px;
  flex: 1 0 auto;
  max-width: 33%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const DoctorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DoctorPart = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const DoctorName = styled.div`
  margin-left: 16px;
`;

export const DoctorSpecialty = styled.div`
  margin-left: 16px;
  font-size: 12px;
  color: #8e8e8e;
`;

export const TicketPart = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const TicketNumber = styled.div`
  font-size: 48px;
  line-height: 2.5rem;

  font-weight: bold;
  color: #0747a6;
  margin-right: 16px;
`;
