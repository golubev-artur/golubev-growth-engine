// Единый сценарий на случай, когда заявка не дошла до сервера приёма лидов.
// Раньше ошибка глушилась, и посетитель видел «Заявка отправлена», хотя заявки
// не было ни у него, ни у нас. Теперь он узнаёт об этом сразу и получает
// прямой способ связаться, а форма остаётся заполненной для повторной отправки.

export const CONTACT_PHONE = "+7 (926) 169-21-14";
export const CONTACT_EMAIL = "info@golubev-consulting.ru";

export const LEAD_ERROR_TITLE = "Заявка не отправилась";

export const LEAD_ERROR_DESCRIPTION =
  `Проверьте связь и попробуйте ещё раз - данные в форме сохранены. ` +
  `Если не получается, позвоните: ${CONTACT_PHONE} или напишите на ${CONTACT_EMAIL}.`;

export const leadErrorToast = {
  variant: "destructive" as const,
  title: LEAD_ERROR_TITLE,
  description: LEAD_ERROR_DESCRIPTION,
};
