import { defineMessages } from "react-intl";

export default defineMessages({
	my_wallets: {
		id: "app.containers.finance.my_wallets",
		defaultMessage: "My Wallets",
	},
	my_wallet: {
		id: "app.containers.finance.my_wallet",
		defaultMessage: "My wallet",
	},
	currency: {
		id: "app.containers.finance.table.currency",
		defaultMessage: "Currency",
	},
	short: {
		id: "app.containers.finance.table.short",
		defaultMessage: "Short",
	},
	full_name: {
		id: "app.containers.finance.table.full_name",
		defaultMessage: "Full Name",
	},
	balance: {
		id: "app.containers.finance.table.balance",
		defaultMessage: "Balance",
	},
	reserved: {
		id: "app.containers.finance.table.reserved",
		defaultMessage: "Reserved",
	},
	deposit: {
		id: "app.containers.finance.table.deposit",
		defaultMessage: "Deposit",
	},
	transfer: {
		id: "app.containers.finance.transfer",
		defaultMessage: "Transfers",
	},
	margin_transfer: {
		id: "app.containers.finance.margin_transfer",
		defaultMessage: "Margin Transfer",
	},
	margin_transfer_tooltip: {
		id: "app.containers.finance.margin_transfer_tooltip",
		defaultMessage: "Funds transfer for maintaining the margin wallet",
	},
	borrow_tooltip: {
		id: "app.containers.finance.borrow_tooltip",
		defaultMessage: "Borrowing funds from exchange",
	},
	repay_tooltip: {
		id: "app.containers.finance.repay_tooltip",
		defaultMessage: "Returning of borrowed funds to the exchange",
	},
	withdraw: {
		id: "app.containers.finance.table.withdraw",
		defaultMessage: "Withdraw",
	},
	withdraw_action: {
		id: "app.containers.finance.withdraw.action",
		defaultMessage: "Withdraw",
	},
	withdraw_funds: {
		id: "app.containers.finance.table.withdraw_funds",
		defaultMessage: "Withdraw funds",
	},
	receive: {
		id: "app.containers.finance.receive",
		defaultMessage: "You'll\n receive",
	},
	fee: {
		id: "app.containers.finance.fee",
		defaultMessage: "Fee to pay:",
	},
	attention: {
		id: "app.containers.finance.attention",
		defaultMessage: "Pay attention on:",
	},
	copy: {
		id: "app.containers.finance.copy",
		defaultMessage: "copy",
	},
	copy_address: {
		id: "app.containers.finance.copy_address",
		defaultMessage: "Copy address",
	},
	no_fee: {
		id: "app.containers.finance.no_fee",
		defaultMessage: "Without fees",
	},
	no_fee_on_deposit: {
		id: "app.containers.finance.no_fee_on_deposit",
		defaultMessage: "We do not have a fee on {currency} deposits.",
	},
	deposit_fee_is: {
		id: "app.containers.finance.deposit_fee_is",
		defaultMessage: "The deposit fee is {fee}.",
	},
	deposit_confirmations: {
		id: "app.containers.finance.deposit_confirmations",
		defaultMessage:
			"Your deposit will be credited after {confirmations} confirmations on the {networkName} network.",
	},
	withdraw_used_limit: {
		id: "app.containers.finance.withdraw.used_limit",
		defaultMessage: "Used withdrawal limit for 24 hours",
	},
	withdraw_varification: {
		id: "app.containers.finance.withdraw_varification",
		defaultMessage: "Withdraw verification",
	},
	withdraw_confirming: {
		id: "app.containers.finance.withdraw_confirming",
		defaultMessage: "Withdraw confirming",
	},
	withdraw_details_check: {
		id: "app.containers.finance.withdraw_details_check",
		defaultMessage: "Please, check the following data correctness.",
	},
	withdraw_varification_desc: {
		id: "app.containers.finance.withdraw_varification_desc",
		defaultMessage:
			"For verifying action and continue, we sent you email message with instructions. Please, check your email address",
	},
	withdraw_confirming_date: {
		id: "app.containers.finance.withdraw_confirming_date",
		defaultMessage: "Date:",
	},
	withdraw_confirming_amount: {
		id: "app.containers.finance.withdraw_confirming_amount",
		defaultMessage: "Amount:",
	},
	withdraw_confirming_currency_id: {
		id: "app.containers.finance.withdraw_confirming_currency_id",
		defaultMessage: "Currency:",
	},
	withdraw_confirming_status: {
		id: "app.containers.finance.withdraw_confirming_status",
		defaultMessage: "Status:",
	},
	withdraw_confirming_chanel: {
		id: "app.containers.finance.withdraw_confirming_chanel",
		defaultMessage: "Chanel:",
	},
	withdraw_confirming_fee_amount: {
		id: "app.containers.finance.withdraw_confirming_fee_amount",
		defaultMessage: "Fee:",
	},
	withdraw_confirming_comment: {
		id: "app.containers.finance.withdraw_confirming_comment",
		defaultMessage: "Comment:",
	},
	withdraw_confirming_error: {
		id: "app.containers.finance.withdraw_confirming_error",
		defaultMessage: "Error occured:",
	},
	previous_deposits: {
		id: "app.containers.finance.previous_deposits",
		defaultMessage: "Previous deposits",
	},
	previous_withdraws: {
		id: "app.containers.finance.previous_withdraws",
		defaultMessage: "Previous withdraws",
	},
	create_deposit: {
		id: "app.containers.finance.create_deposit",
		defaultMessage: "Create deposit",
	},
	not_empty: {
		id: "app.containers.finance.not_empty",
		defaultMessage: "Not empty",
	},
	daily_limit_unused: {
		id: "app.containers.finance.withdraw.daily_limit",
		defaultMessage: "{limit_link} not used.",
	},
	daily_limit_partial_used: {
		id: "app.containers.finance.withdraw.daily_limit_partial_used",
		defaultMessage: "Part of the {limit_link} used.",
	},
	daily_limit_used: {
		id: "app.containers.finance.withdraw.daily_limit_used",
		defaultMessage: "{limit_link} exceeded for today.",
	},
	no_limit: {
		id: "app.containers.finance.withdraw.no_limit",
		defaultMessage: "Withdrawal limit removed",
	},
	available_limit: {
		id: "app.containers.finance.withdraw.available",
		defaultMessage: "KYC Level {level} is available to you. {verification_link}",
	},
	withdraw_verification_level: {
		id: "app.containers.finance.withdraw.withdraw_verification_level",
		defaultMessage:
			"For indefinite limit - go through {verification_link} to Level {level} or wait a while for the limit to be updated.",
	},
	deposit_verification_level: {
		id: "app.containers.finance.deposit.deposit_verification_level",
		defaultMessage: "To create this deposit you need to pass Verification {level} level",
	},
	rest_withdraw_quota: {
		id: "app.containers.finance.withdraw.rest_withdraw_quota",
		defaultMessage:
			"You've withdrawn {withdraw_count} {currency} out of {limit} {currency} from today. You may withdraw another ≈ {withdraw_rest_count} {withdraw_currency}.",
	},
	pass_kyc: {
		id: "app.containers.finance.pass_kyc",
		defaultMessage: "Pass KYC",
	},
	all_requisite_required: {
		id: "app.containers.finance.all_requisite_required",
		defaultMessage: "All requisite elements are required",
	},
	average_time_to_receive_funds: {
		id: "app.containers.finance.average_time_to_receive_funds",
		defaultMessage: "Average time to receive funds",
	},
	withdraw_unavailable: {
		id: "app.containers.finance.withdraw.unavailable",
		defaultMessage: "Withdraw unavailable, you have used all limit for 24 h",
	},
	withdrawal_method: {
		id: "app.containers.finance.withdrawal_method",
		defaultMessage: "Withdrawal method",
	},
	deposit_method: {
		id: "app.containers.finance.deposit_method",
		defaultMessage: "Deposit method",
	},
	used_of_quota: {
		id: "app.containers.finance.withdraw.used_of_quota",
		defaultMessage: "{used} out of {quota}",
	},
	used_from_quota: {
		id: "app.containers.finance.withdraw.used_from_quota",
		defaultMessage: "Used from limit",
	},
	limit: {
		id: "app.containers.finance.withdraw.limit",
		defaultMessage: "Limit",
	},
	verification: {
		id: "app.containers.finance.withdraw.verification",
		defaultMessage: "Verification",
	},
	main_currencies: {
		id: "app.containers.finance.withdraw.main_currencies",
		defaultMessage: "Main",
	},
	demo_currencies: {
		id: "app.containers.finance.withdraw.demo_currencies",
		defaultMessage: "Demo",
	},
	overall_balance: {
		id: "app.containers.finance.overall_balance",
		defaultMessage: "Overall balance",
	},
	reserve: {
		id: "app.containers.finance.reserve",
		defaultMessage: "Reserve",
	},
	available: {
		id: "app.containers.finance.available",
		defaultMessage: "Available",
	},
	total_balance: {
		id: "app.containers.finance.total_balance",
		defaultMessage: "Total Balance",
	},
	btc_valuation: {
		id: "app.containers.finance.btc_valuation",
		defaultMessage: "BTC Valuation",
	},
	choose_operation: {
		id: "app.containers.finance.choose_operation",
		defaultMessage: "Choose operation",
	},
	select_currency: {
		id: "app.containers.finance.select_currency",
		defaultMessage: "Select currency",
	},
	enter_recipient_details: {
		id: "app.containers.finance.enter_recipient_details",
		defaultMessage: "Enter the details of the recipient",
	},
	address_book: {
		id: "app.containers.finance.address_book",
		defaultMessage: "Address book",
	},
	withdraw_min_sum: {
		id: "app.containers.finance.withdraw.min_amount",
		defaultMessage: "Minimum withdrawal amount",
	},
	make_a_note: {
		id: "app.containers.finance.make_a_note",
		defaultMessage: "Make a note",
	},
	note_tooltip: {
		id: "app.containers.finance.note_tooltip",
		defaultMessage: "Only you can see the comment. It will be displayed in the withdrawal history",
	},
	view_fees: {
		id: "app.containers.finance.view_fees",
		defaultMessage: "View fees",
	},
	withdrawal_tutorial: {
		id: "app.containers.finance.withdraw.tutorial",
		defaultMessage: "How-To Guide (for beginners)",
	},
	deposit_tutorial: {
		id: "app.containers.finance.deposit.tutorial",
		defaultMessage: "Deposits Guide (For Beginners)",
	},
	deposit_unavailable: {
		id: "app.containers.finance.deposit.unavailable",
		defaultMessage: "Deposit of this coin is unavailable",
	},
	deposit_successful: {
		id: "app.containers.finance.deposit_successful",
		defaultMessage: "Deposit successful",
	},
	deposit_warning: {
		id: "app.containers.finance.deposit.warning",
		defaultMessage:
			"For wallet replenishment, send only {currency} to this address. Sending other assets to this address will result in their loss.",
	},
	payment_details: {
		id: "app.containers.finance.payment_details",
		defaultMessage: "Payment details",
	},
	withdrawal_info_1: {
		id: "app.containers.finance.withdraw.info_1",
		defaultMessage:
			"Do not withdraw funds to the accounts of crowdfunding companies and ICOs, since no tokens will be credited to your account.",
	},
	withdrawal_info_2: {
		id: "app.containers.finance.withdraw.info_2",
		defaultMessage:
			"When using an internal transfer to the account of the exchange user, no fee is charged.",
	},
	perform_an_internal_transfer: {
		id: "app.containers.finance.perform_an_internal_transfer",
		defaultMessage: "Perform an internal transfer",
	},
	time_to_confirm_withdrawal_has_expired: {
		id: "app.containers.finance.withdraw.time_to_confirm_has_expired",
		defaultMessage: "Time to confirm withdrawal has expired",
	},
	time_to_confirm_withdrawal_is_limited: {
		id: "app.containers.finance.withdraw.time_to_confirm_is_limited",
		defaultMessage:
			"The time for confirming the withdrawal is limited. Please create your application again.",
	},
	save_address: {
		id: "app.containers.finance.withdraw.save_address",
		defaultMessage: "Save address",
	},
	create_new_withdraw: {
		id: "app.containers.finance.withdraw.create_new",
		defaultMessage: "Create new withdraw",
	},
	go_to_my_wallet: {
		id: "app.containers.finance.go_to_my_wallet",
		defaultMessage: "Go to My wallet",
	},
	check_operation_details: {
		id: "app.containers.finance.withdraw.check_operation_details",
		defaultMessage: "Please check the details of the operation carefully",
	},
	withdrawal_application_created: {
		id: "app.containers.finance.withdraw.application_created",
		defaultMessage: "Withdrawal application was created",
	},
	withdrawal_was_sent_to_moderation: {
		id: "app.containers.finance.withdraw.was_sent_to_moderation",
		defaultMessage:
			"Thank you for your request! Your withdrawal request is pending on moderation. On average, the processing lasts around 24 hours.",
	},
	withdraw_canceled: {
		id: "app.containers.finance.withdraw.canceled",
		defaultMessage: "Withdraw canceled",
	},
	withdraw_cancelation: {
		id: "app.containers.finance.withdraw.cancelation",
		defaultMessage: "Withdraw cancelation",
	},
	withdraw_cancelation_question: {
		id: "app.containers.finance.withdraw.cancelation_question",
		defaultMessage: "You are about to cancel your withdraw?",
	},
	error_use_only_digits: {
		id: "app.containers.finance.error.use_only_digits",
		defaultMessage: "Error. Please, use only digits.",
	},
	error_invalid_field: {
		id: "app.containers.finance.error.invalid_field",
		defaultMessage: "Error. Invalid {field}.",
	},
	error_invalid_length_min: {
		id: "app.containers.finance.error.invalid_length_min",
		defaultMessage: "Error. Invalid length of {field}. Min: {length}.",
	},
	error_invalid_length_max: {
		id: "app.containers.finance.error.invalid_length_max",
		defaultMessage: "Error. Invalid length of {field}. max: {length}.",
	},
	withdrawal_is_not_available: {
		id: "app.containers.finance.withdraw.not_available",
		defaultMessage: "Withdrawal for this coin is not available",
	},
	withdraw_is_impossible_alc: {
		id: "app.containers.finance.withdraw.is_impossible_alc",
		defaultMessage: "ALC is for Social Listing only.",
	},
	withdraw_is_impossible_demo: {
		id: "app.containers.finance.withdraw.is_impossible_demo",
		defaultMessage: "Withdraw is impossible. Demo currency is for Demo trading only.",
	},
	copied_to_clipboard: {
		id: "app.containers.finance.copied",
		defaultMessage: "{label} copied to clipboard",
	},
	return_to_trades: {
		id: "app.containers.finance.return_to_trades",
		defaultMessage: "Return to trades",
	},
	troubles_with_deposit: {
		id: "app.containers.finance.troubles_with_deposit",
		defaultMessage: "Troubles with deposit?",
	},
	transfer_error: {
		id: "app.containers.finance.transfer_error",
		defaultMessage: "Transfer error",
	},
	approximate_balance: {
		id: "app.containers.finance.approximate_balance",
		defaultMessage: "Approximate balance",
	},
	main_spot: {
		id: "app.containers.finance.main_spot",
		defaultMessage: "AdsPage spot",
	},
	hide_empty_balances: {
		id: "app.containers.finance.hide_empty_balances",
		defaultMessage: "Hide empty balances",
	},
	hide_balance: {
		id: "app.containers.finance.hide_balance",
		defaultMessage: "Hide balance",
	},
	show_balance: {
		id: "app.containers.finance.show_balance",
		defaultMessage: "Show balance",
	},
	trade: {
		id: "app.containers.finance.trade",
		defaultMessage: "Trade",
	},
	withdrawal_time_warning: {
		id: "app.containers.finance.withdrawal_time_warning",
		defaultMessage: "Fund withdrawal for your account will become available on {datetime}",
	},
	operations: {
		id: "app.containers.finance.operations",
		defaultMessage: "Operations",
	},
});
