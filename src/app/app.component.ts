import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import dataBase from '../assets/data';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [FormsModule, CommonModule],
})
export class AppComponent implements OnInit {
  jsonData = dataBase;

  displayedData: any[] = [];
  entriesPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number = 1;
  searchTerm: string = '';
  sortKey: string = '';
  sortDirection: number = 1;
  columnVisibility: { [key: string]: boolean } = {
    _id: true,
    isActive: true,
    balance: true,
    picture: true,
    age: true,
    name: true,
    company: true,
    email: true,
    address: true,
    tags: true,
    favoriteFruit: true,
  };

  ngOnInit(): void {
    this.updateTable();
  }

  updateTable(): void {
    // Apply filtering
    let filteredData = this.jsonData.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );

    // Apply sorting
    if (this.sortKey) {
      filteredData = filteredData.sort((a: any, b: any) => {
        const aValue = a[this.sortKey];
        const bValue = b[this.sortKey];
        return (aValue < bValue ? -1 : 1) * this.sortDirection;
      });
    }

    // Update displayed data based on pagination
    const startIndex = (this.currentPage - 1) * this.entriesPerPage;
    this.displayedData = filteredData.slice(
      startIndex,
      startIndex + this.entriesPerPage
    );

    // Update total pages
    this.totalPages = Math.ceil(filteredData.length / this.entriesPerPage);
  }

  sortTable(key: string): void {
    if (this.sortKey === key) {
      this.sortDirection = -this.sortDirection; // Toggle sort direction if clicking the same column
    } else {
      this.sortKey = key;
      this.sortDirection = 1;
    }

    this.updateTable();
  }

  changePage(action: 'prev' | 'next'): void {
    if (action === 'prev' && this.currentPage > 1) {
      this.currentPage--;
    } else if (action === 'next' && this.currentPage < this.totalPages) {
      this.currentPage++;
    }

    this.updateTable();
  }

  toggleColumnVisibility(): void {
    // Toggle visibility for all columns
    Object.keys(this.columnVisibility).forEach((key) => {
      this.columnVisibility[key] = !this.columnVisibility[key];
    });
  }
}
