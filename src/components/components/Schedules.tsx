import { Schedule } from '../../@types/organism';
import { useAppState } from '../../hooks/appState';
import { getOpeningHours } from '../../utils/format';

interface Props {
  schedule: Schedule[];
}

export default function Schedules({ schedule }: Props) {
  const { organismState } = useAppState();
  const { days } = organismState;

  // Créer une copie du tableau avant de trier
  const orderedSchedule = schedule.map((objet) => ({ ...objet }));
  // Trier les objets par le jour (day) en ordre croissant
  orderedSchedule.sort((a, b) => a.day - b.day);

  return (
    <table className="flex flex-col flex-1">
      <tbody className="flex flex-col flex-1 gap-1 divide-y divide-gray-100">
        {orderedSchedule
          .sort((a, b) => a.day - b.day)
          .map(
            (currentDay) =>
              getOpeningHours(currentDay) !== null && (
                <tr
                  key={currentDay.day}
                  className="flex justify-between flex-1 pt-1 text-sm"
                >
                  <td className="basis-5/12">
                    <div>
                      {
                        days.find((day) => day.numberday === currentDay.day)
                          ?.name
                      }
                    </div>
                  </td>
                  <td className="flex-1 basis-7/12">
                    {getOpeningHours(currentDay)}
                  </td>
                </tr>
              )
          )}
      </tbody>
    </table>
  );
}
