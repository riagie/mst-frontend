<template>
    <div>
        <b-container class="my-5">
            <b-row>
                <b-col>
                    <b-card title="Input Transaksi" class="mb-4">
                        <b-form @submit.prevent="submitTransaction">
                            <b-form-group label="No TRX">
                                <b-form-input v-model="transaction.kode" readonly></b-form-input>
                            </b-form-group>
                            <b-form-group label="Tanggal">
                                <b-form-input v-model="transaction.tanggal" readonly></b-form-input>
                            </b-form-group>
                            <b-form-group label="Customer">
                                <b-input-group>
                                    <b-form-select v-model="transaction.cust_id" :options="customerOptions"
                                        @change="updateCustomerInfo"></b-form-select>
                                    <b-input-group-append>
                                        <b-button @click="fetchCustomers">Pilih</b-button>
                                    </b-input-group-append>
                                </b-input-group>
                            </b-form-group>
                            <b-form-group label="Nama">
                                <b-form-input v-model="selectedCustomer.name" readonly></b-form-input>
                            </b-form-group>
                            <b-form-group label="Telp">
                                <b-form-input v-model="selectedCustomer.telp" readonly></b-form-input>
                            </b-form-group>
                            <b-form-group label="Diskon">
                                <b-form-input v-model="transaction.diskon" type="number"></b-form-input>
                            </b-form-group>
                            <b-form-group label="Ongkir">
                                <b-form-input v-model="transaction.ongkir" type="number"></b-form-input>
                            </b-form-group>
                            <b-form-group>
                                <b-button @click="showBarangModal">Tambah Barang</b-button>
                            </b-form-group>
                            <b-table :items="transaction.barang" :fields="barangFields" striped hover bordered>
                                <template #cell(qty)="data">
                                    <b-form-input v-model.number="data.item.qty" type="number" min="1"
                                        step="1"></b-form-input>
                                </template>
                                <template #cell(actions)="data">
                                    <b-button size="sm" @click="removeBarang(data.index)">Hapus</b-button>
                                </template>
                            </b-table>
                            <b-button type="submit" variant="primary">Simpan Transaksi</b-button>
                        </b-form>
                    </b-card>
                    <b-modal ref="barangModal" title="Pilih Barang">
                        <b-table :items="barangOptions" :fields="barangModalFields" striped hover bordered selectable
                            @row-selected="selectBarang">
                            <template #cell(diskon)="data">
                                {{ data.item.diskon[0]?.diskon_pct }}%
                            </template>
                        </b-table>
                        <b-button @click="addSelectedBarang">Tambah</b-button>
                    </b-modal>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-button href="/" variant="primary">Back to Home</b-button>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
export default {
    data() {
        return {
            transaction: {
                kode: '', // Kode akan dihasilkan secara otomatis
                tanggal: new Date().toISOString().slice(0, 10),
                cust_id: '',
                diskon: 0,
                ongkir: 0,
                barang: []
            },
            customerOptions: [],
            selectedCustomer: {
                name: '',
                telp: ''
            },
            barangOptions: [],
            selectedBarang: null,
            barangFields: [
                { key: 'kode', label: 'Kode Barang' },
                { key: 'nama', label: 'Nama Barang' },
                { key: 'harga', label: 'Harga' },
                { key: 'qty', label: 'Qty' },
                { key: 'actions', label: 'Actions' }
            ],
            barangModalFields: [
                { key: 'kode', label: 'Kode Barang' },
                { key: 'nama', label: 'Nama Barang' },
                { key: 'harga', label: 'Harga' },
                { key: 'diskon', label: 'Diskon' }
            ]
        }
    },
    methods: {
        generateKode() {
            const date = new Date();
            const year = date.getFullYear().toString().slice(-2);
            const month = ('0' + (date.getMonth() + 1)).slice(-2);
            const day = ('0' + date.getDate()).slice(-2);
            const hours = ('0' + date.getHours()).slice(-2);
            const minutes = ('0' + date.getMinutes()).slice(-2);
            const seconds = ('0' + date.getSeconds()).slice(-2);
            return `TRX${year}${month}${day}${hours}${minutes}${seconds}`;
        },
        fetchCustomers() {
            this.$axios.$get('/customer').then((response) => {
                this.customerOptions = response.map(customer => ({
                    value: customer.kode,
                    text: `${customer.kode} - ${customer.name}`,
                    name: customer.name,
                    telp: customer.telp
                }));
            });
        },
        fetchBarang() {
            this.$axios.$get('/barang_with_diskon').then((response) => {
                this.barangOptions = response;
            });
        },
        showBarangModal() {
            this.fetchBarang();
            this.$refs.barangModal.show();
        },
        selectBarang(items) {
            this.selectedBarang = items[0];
        },
        addSelectedBarang() {
            if (this.selectedBarang) {
                const barang = { ...this.selectedBarang, qty: 1 }; // Default qty = 1
                this.transaction.barang.push(barang);
                this.$refs.barangModal.hide();
            }
        },
        removeBarang(index) {
            this.transaction.barang.splice(index, 1);
        },
        updateCustomerInfo() {
            const selected = this.customerOptions.find(option => option.value === this.transaction.cust_id);
            if (selected) {
                this.selectedCustomer.name = selected.name;
                this.selectedCustomer.telp = selected.telp;
            } else {
                this.selectedCustomer.name = '';
                this.selectedCustomer.telp = '';
            }
        },
        submitTransaction() {
            const transaksiPayload = {
                kode: this.transaction.kode,
                tanggal: this.transaction.tanggal,
                cust_id: this.transaction.cust_id,
                diskon: this.transaction.diskon,
                ongkir: this.transaction.ongkir,
                barang: this.transaction.barang.map(b => ({
                    kode: b.kode,
                    qty: b.qty
                }))
            };
            this.$axios.post('/transaksi', transaksiPayload)
                .then(() => {
                    this.$bvToast.toast('Transaksi berhasil disimpan!', {
                        title: 'Sukses',
                        variant: 'success',
                        solid: true
                    });
                    setTimeout(() => {
                        this.$router.go(0); // Reload halaman
                    }, 2000); // Delay 2 detik sebelum reload
                })
                .catch(() => {
                    this.$bvToast.toast('Gagal menyimpan transaksi. Silakan coba lagi.', {
                        title: 'Gagal',
                        variant: 'danger',
                        solid: true
                    });
                });
        }
    },
    watch: {
        'transaction.cust_id': function (newVal) {
            this.updateCustomerInfo();
        }
    },
    mounted() {
        this.transaction.kode = this.generateKode();
        this.fetchCustomers();
    }
}
</script>

<style scoped>
.mb-4 {
    margin-bottom: 1.5rem;
}

.b-button {
    margin-top: 1rem;
}

.b-form-input {
    max-width: 300px;
}
</style>