import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kpkmrcieprtwnzjtftki.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtwa21yY2llcHJ0d256anRmdGtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2OTMzMjEsImV4cCI6MjA5NzI2OTMyMX0.EUgl5MIGdKlDSYhB_f15iigYIHYwHR0G6anGsiQBTT4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDb() {
  console.log("Fetching hirers...");
  const { data: hirers, error: hirerError } = await supabase.from('hirers').select('*');
  if (hirerError) {
    console.error("Error fetching hirers:", hirerError);
  } else {
    console.log("Hirers found:", hirers.length);
    hirers.forEach(h => {
      console.log(`Hirer: ID=${h.id}, auth_user_id=${h.auth_user_id}, name=${h.first_name} ${h.last_name}`);
    });
  }

  console.log("\nFetching bank accounts...");
  const { data: accounts, error: accountError } = await supabase.from('hirer_bank_accounts').select('*');
  if (accountError) {
    console.error("Error fetching bank accounts:", accountError);
  } else {
    console.log("Bank accounts found:", accounts.length);
    accounts.forEach(a => {
      console.log(`Account: ID=${a.id}, hirer_id=${a.hirer_id}, holder=${a.account_holder_name}, number=${a.account_number}`);
    });
  }
}

checkDb();
