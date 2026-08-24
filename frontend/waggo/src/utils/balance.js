export const PEOPLE = ['Bram', 'Anne'];

function sumBy(records, groupKey, valueKey) {
  return records.reduce(
    (acc, record) => {
      const group = record[groupKey];
      if (group in acc) {
        acc[group] += parseFloat(record[valueKey]) || 0;
      }
      return acc;
    },
    { Bram: 0, Anne: 0 }
  );
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

/**
 * Compute the settlement between Bram and Anne.
 *
 * Expenses are shared in proportion to km driven: each person's fair share of the
 * total expenses equals their share of the total km driven. Their net is what they
 * actually paid minus that fair share. A positive net means they overpaid, so the
 * other person owes them the difference.
 */
export function computeBalance(rides, expenses) {
  const km = sumBy(rides, 'driver', 'distance');
  const paid = sumBy(expenses, 'payer', 'amount');

  const totalKm = km.Bram + km.Anne;
  const totalPaid = paid.Bram + paid.Anne;

  const kmShare = totalKm > 0
    ? { Bram: km.Bram / totalKm, Anne: km.Anne / totalKm }
    : { Bram: 0.5, Anne: 0.5 };

  const paidShare = totalPaid > 0
    ? { Bram: paid.Bram / totalPaid, Anne: paid.Anne / totalPaid }
    : { Bram: 0, Anne: 0 };

  const fairShare = {
    Bram: kmShare.Bram * totalPaid,
    Anne: kmShare.Anne * totalPaid,
  };

  const net = {
    Bram: paid.Bram - fairShare.Bram,
    Anne: paid.Anne - fairShare.Anne,
  };

  // Whoever has the negative net underpaid and owes the other person.
  const amount = round2(Math.abs(net.Bram));
  let settlement;
  if (amount === 0) {
    settlement = { from: null, to: null, amount: 0 };
  } else if (net.Bram < 0) {
    settlement = { from: 'Bram', to: 'Anne', amount };
  } else {
    settlement = { from: 'Anne', to: 'Bram', amount };
  }

  return {
    km,
    paid,
    totalKm,
    totalPaid,
    kmShare,
    paidShare,
    fairShare,
    net,
    settlement,
  };
}
