import * as React from "react";
import WarningIcon from "@atlaskit/icon/glyph/warning";
import { AutoDismissFlag, FlagGroup } from "@atlaskit/flag";
import { AppearanceTypes } from "@atlaskit/flag/types";
import SuccessIcon from "@atlaskit/icon/glyph/check-circle";
import { G400, R400, Y200, N500, G300 } from "@atlaskit/theme/colors";
import ErrorIcon from "@atlaskit/icon/glyph/error";
import InfoIcon from "@atlaskit/icon/glyph/info";
import { io } from "socket.io-client";

interface Flag {
  appearance?: AppearanceTypes;
  title: string;
  description?: string;
}

export const NotificationCenter = () => {
  const [flags, setFlags] = React.useState<Array<Flag & { id: number }>>([]);

  const addFlag = React.useCallback((flag: Flag) => {
    setFlags((oldFlags) => [{ id: oldFlags.length + 1, ...flag }, ...oldFlags]);
  }, []);

  React.useEffect(() => {
    const doctorSocket = io("/doctors");
    doctorSocket.on("updateDoctor", () =>
      addFlag({ appearance: "success", title: "A doctor has been updated information" })
    );
    doctorSocket.on("addDoctor", () => addFlag({ appearance: "success", title: "A doctor has been added" }));
    doctorSocket.on("deleteDoctor", () => addFlag({ appearance: "error", title: "A doctor has been deleted" }));

    const queuesSocket = io("/queues");
    queuesSocket.on("openQueue", () => addFlag({ appearance: "success", title: "A new queue has been opened" }));
    queuesSocket.on("closeQueue", () => addFlag({ appearance: "warning", title: "The queue has been closed" }));

    const patientSocket = io("/patients");
    patientSocket.on("addPatient", () => addFlag({ title: "A new patient has arrived" }));

    return () => {
      doctorSocket.close();
      queuesSocket.close();
      queuesSocket.close();
      patientSocket.close();
    };
  }, [addFlag]);

  const handleDismiss = () => {
    setFlags(flags.slice(1));
  };

  return (
    <FlagGroup onDismissed={handleDismiss}>
      {flags.map((flag) => {
        return (
          <AutoDismissFlag
            appearance={flag.appearance}
            id={flag.id}
            key={flag.id}
            icon={getIcon(flag.appearance)}
            title={flag.title}
            description={flag.description}
          />
        );
      })}
    </FlagGroup>
  );
};

function getIcon(appearance?: AppearanceTypes): React.ReactNode {
  switch (appearance) {
    case "success":
      return <SuccessIcon label="Success" secondaryColor={G400} />;
    case "error":
      return <ErrorIcon label="Error" secondaryColor={R400} />;
    case "warning":
      return <WarningIcon label="Warning" secondaryColor={Y200} />;
    case "info":
      return <InfoIcon label="Info" secondaryColor={N500} />;
    default:
      return <SuccessIcon primaryColor={G300} label="Success" size="medium" />;
  }
}
