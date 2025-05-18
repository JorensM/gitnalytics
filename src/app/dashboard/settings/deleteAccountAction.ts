"use server";
import { deleteAccount } from '@/util/auth';

export default async function deleteAccountAction() {
    await deleteAccount();
}