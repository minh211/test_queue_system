import * as React from "react";
import styled from "styled-components";
import Avatar from "@atlaskit/avatar";
import Button from "@atlaskit/button";

export interface TicketCardProps {
  readonly ticketNumber?: number;
  readonly patient?: {
    firstName: string;
    lastName: string;
  };
  readonly doctor: {
    firstName: string;
    lastName: string;
  };
  onClick?(): void;
  disabled?: boolean;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticketNumber, onClick, disabled, patient, doctor }) => {
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
        {ticketNumber && patient ? (
          <>
            <TicketNumber>{("" + ticketNumber).padStart(3, "0")}</TicketNumber>
            <div className="ticket-card__patient">
              <div className="ticket-card__patient-name">
                {patient.firstName} {patient.lastName}
              </div>
            </div>
          </>
        ) : null}
      </TicketPart>
      {onClick && (
        <Button style={{ borderRadius: 0 }} isDisabled={disabled} onClick={onClick}>
          Next patient
        </Button>
      )}
    </CardWrapper>
  );
};

export const CardWrapper = styled.div`
  max-height: 250px;
  flex: 1 0 auto;
  min-width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #0747a6;
`;

export const DoctorPart = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: #0747a6;

  border-bottom: 1px solid #0747a6;
`;

export const DoctorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DoctorName = styled.div`
  margin-left: 16px;

  color: hsl(0, 50%, 90%);
`;

export const DoctorSpecialty = styled.div`
  margin-left: 16px;
  font-size: 12px;
  color: #8e8e8e;
`;

export const TicketPart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  min-height: 100px;
`;

export const TicketNumber = styled.div`
  font-size: 48px;
  line-height: 2.5rem;

  font-weight: bold;
  color: #0747a6;
  margin-bottom: 16px;
`;
